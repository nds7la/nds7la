// services/rss.service.ts

import Parser from "feedparser";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";
import { aiService } from "./ai.service";

interface FeedItem {
  title: string;
  description?: string;
  content?: string;
  link: string;
  pubDate: string;
  author?: string;
  image?: string;
}

class RSSService {
  /**
   * Fetch and parse RSS feed
   */
  async fetchFeed(url: string): Promise<FeedItem[]> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      return new Promise((resolve, reject) => {
        const parser = new Parser();
        const items: FeedItem[] = [];

        parser.on("error", (error) => {
          reject(error);
        });

        parser.on("readable", function () {
          let item;
          while ((item = this.read())) {
            items.push({
              title: item.title || "Untitled",
              description: item.description || "",
              content: item.content || item.summary || "",
              link: item.link || "",
              pubDate: item.pubDate || new Date().toISOString(),
              author: item.author || "",
              image: item.image?.url || item.image || "",
            });
          }
        });

        parser.on("end", () => {
          resolve(items);
        });

        parser.write(response.data);
        parser.close();
      });
    } catch (error) {
      await log("RSS_FETCH", "ERROR", `Failed to fetch RSS feed: ${url}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Fetch all active RSS sources
   */
  async fetchAllSources(): Promise<void> {
    try {
      const sources = await prisma.rssSource.findMany({
        where: { isActive: true },
      });

      await log("RSS_FETCH", "INFO", `Fetching ${sources.length} RSS sources`);

      for (const source of sources) {
        await this.processSingleSource(source);
      }
    } catch (error) {
      await log("RSS_FETCH", "ERROR", `Error fetching all sources`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Process a single RSS source
   */
  private async processSingleSource(
    source: any
  ): Promise<void> {
    const startTime = Date.now();

    try {
      const items = await this.fetchFeed(source.url);
      let newArticlesCount = 0;
      let duplicatesCount = 0;

      for (const item of items) {
        // Check if article already exists
        const existingArticle = await prisma.article.findFirst({
          where: {
            originalUrl: item.link,
          },
        });

        if (existingArticle) {
          duplicatesCount++;
          continue;
        }

        // Create new article
        const article = await prisma.article.create({
          data: {
            title: item.title,
            originalUrl: item.link,
            sourceId: source.id,
            sourceTitle: source.name,
            publishedAt: new Date(item.pubDate),
            description: item.description,
            content: item.content,
            status: "NEW",
          },
        });

        newArticlesCount++;

        // Analyze article
        try {
          const analysis = await aiService.analyzeArticle(
            article.id,
            item.title,
            item.description || "",
            item.content || "",
            source.name
          );

          // Update article status based on analysis
          if (analysis.shouldUse) {
            await prisma.article.update({
              where: { id: article.id },
              data: { status: "ANALYZED" },
            });
          } else {
            await prisma.article.update({
              where: { id: article.id },
              data: { status: "REJECTED" },
            });
          }
        } catch (error) {
          await log("AI_ANALYSIS", "ERROR", `Failed to analyze article`, {
            articleId: article.id,
            error: error instanceof Error ? error.message : String(error),
          });

          await prisma.article.update({
            where: { id: article.id },
            data: { status: "FAILED" },
          });
        }
      }

      // Update source metadata
      await prisma.rssSource.update({
        where: { id: source.id },
        data: {
          lastFetchedAt: new Date(),
          lastSuccessAt: new Date(),
          lastErrorMsg: null,
        },
      });

      await log(
        "RSS_FETCH",
        "INFO",
        `Source "${source.name}" fetched successfully`,
        {
          newArticles: newArticlesCount,
          duplicates: duplicatesCount,
          processingTime: Date.now() - startTime,
        }
      );
    } catch (error) {
      await prisma.rssSource.update({
        where: { id: source.id },
        data: {
          lastErrorAt: new Date(),
          lastErrorMsg:
            error instanceof Error ? error.message : String(error),
        },
      });

      await log("RSS_FETCH", "ERROR", `Failed to process source: ${source.name}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get RSS feed health statistics
   */
  async getSourcesHealth(): Promise<{
    total: number;
    active: number;
    inactive: number;
    healthy: number;
    withErrors: number;
    lastFetchStats: any;
  }> {
    const sources = await prisma.rssSource.findMany();
    const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const active = sources.filter((s) => s.isActive).length;
    const healthy = sources.filter(
      (s) =>
        s.isActive &&
        s.lastSuccessAt &&
        s.lastSuccessAt > lastDay &&
        !s.lastErrorMsg
    ).length;
    const withErrors = sources.filter((s) => s.lastErrorMsg).length;

    const recentFetches = await prisma.log.findMany({
      where: {
        category: "RSS_FETCH",
        createdAt: { gte: lastDay },
      },
    });

    return {
      total: sources.length,
      active,
      inactive: sources.length - active,
      healthy,
      withErrors,
      lastFetchStats: {
        totalFetches: recentFetches.length,
        errors: recentFetches.filter((l) => l.level === "ERROR").length,
      },
    };
  }
}

export const rssService = new RSSService();
