// services/ai.service.ts

import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AnalysisResult {
  titleCleaned: string;
  oneSentenceSummary: string;
  fullSummary: string;
  languageDetected: string;
  category: string;
  subcategory: string;
  sentiment: "positive" | "neutral" | "negative";
  positivityScore: number;
  relevanceScore: number;
  noveltyScore: number;
  viralityScore: number;
  trustworthinessScore: number;
  shouldUse: boolean;
  rejectionReason?: string;
  suggestedAngle?: string;
  keyPoints: string[];
  keywords: string[];
  imagePromptBase?: string;
  factSafetyNote?: string;
}

interface GeneratedContent {
  masterSummary: string;
  seoTitle: string;
  metaDescription: string;
  suggestedHashtags: string[];
  telegramText: string;
  twitterText: string;
  instagramCaption: string;
  facebookPost: string;
  pinterestDescription: string;
  websiteArticle: string;
  pushNotification?: string;
}

class AIService {
  /**
   * Analyze article using Claude for filtering and scoring
   */
  async analyzeArticle(
    articleId: string,
    title: string,
    description: string,
    content: string,
    sourceName: string
  ): Promise<AnalysisResult> {
    const startTime = Date.now();

    try {
      const systemPrompt = await this.getPromptTemplate("AI_ANALYSIS");
      const userPrompt = `
Article Title: ${title}
Source: ${sourceName}

Article Description:
${description}

Article Content:
${content}

Please analyze this article thoroughly. Return a JSON object with all required fields.
`;

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const responseText =
        response.content[0].type === "text" ? response.content[0].text : "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from Claude");
      }

      const analysis = JSON.parse(jsonMatch[0]) as AnalysisResult;

      // Store analysis
      await prisma.aiAnalysis.create({
        data: {
          articleId,
          titleCleaned: analysis.titleCleaned,
          oneSentenceSummary: analysis.oneSentenceSummary,
          fullSummary: analysis.fullSummary,
          languageDetected: analysis.languageDetected,
          category: analysis.category,
          subcategory: analysis.subcategory || "",
          sentiment: analysis.sentiment,
          positivityScore: analysis.positivityScore,
          relevanceScore: analysis.relevanceScore,
          noveltyScore: analysis.noveltyScore,
          viralityScore: analysis.viralityScore,
          trustworthinessScore: analysis.trustworthinessScore,
          shouldUse: analysis.shouldUse,
          rejectionReason: analysis.rejectionReason,
          suggestedAngle: analysis.suggestedAngle,
          keyPoints: analysis.keyPoints,
          keywords: analysis.keywords,
          imagePromptBase: analysis.imagePromptBase,
          factSafetyNote: analysis.factSafetyNote,
          rawResponse: responseText,
          processingTime: Date.now() - startTime,
        },
      });

      // Update article with scores
      await prisma.article.update({
        where: { id: articleId },
        data: {
          positivityScore: analysis.positivityScore,
          relevanceScore: analysis.relevanceScore,
          noveltyScore: analysis.noveltyScore,
          overallScore: Math.round(
            (analysis.positivityScore +
              analysis.relevanceScore +
              analysis.noveltyScore) /
              3
          ),
        },
      });

      await log("AI_ANALYSIS", "INFO", `Article ${articleId} analyzed`, {
        scores: {
          positivity: analysis.positivityScore,
          relevance: analysis.relevanceScore,
          novelty: analysis.noveltyScore,
        },
      });

      return analysis;
    } catch (error) {
      await log("AI_ANALYSIS", "ERROR", `Failed to analyze article`, {
        articleId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Generate platform-specific content using Claude
   */
  async generateContent(
    articleId: string,
    title: string,
    summary: string,
    keyPoints: string[]
  ): Promise<GeneratedContent> {
    const startTime = Date.now();

    try {
      const systemPrompt = `You are an expert content writer specializing in positive news for social media and web platforms. 
Your content must be:
- Concise and to the point
- Engaging and inspiring
- Platform-appropriate
- Free of clickbait
- Factually grounded
- Uplifting in tone

You will receive an article summary and generate platform-specific content for multiple social media platforms and a website article.`;

      const userPrompt = `
Article Title: ${title}
Summary: ${summary}
Key Points: ${keyPoints.join(", ")}

Generate content for these platforms:
1. Telegram (informative, can be longer, ~500 chars max)
2. Twitter/X (short & punchy, 280 chars max, with hashtags)
3. Instagram (emotional, ~2000 chars max, emojis, CTA)
4. Facebook (friendly, ~1000 chars max, with link)
5. Pinterest (descriptive, ~200 chars max, keyword-rich)
6. Website (SEO optimized article, ~1000 words)

Return a JSON object with these keys:
{
  "masterSummary": "one paragraph universal summary",
  "seoTitle": "SEO optimized title",
  "metaDescription": "meta description for web",
  "suggestedHashtags": ["hashtag1", "hashtag2"],
  "telegramText": "telegram version",
  "twitterText": "twitter version",
  "instagramCaption": "instagram version",
  "facebookPost": "facebook version",
  "pinterestDescription": "pinterest version",
  "websiteArticle": "full website article",
  "pushNotification": "optional push notification version"
}`;

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const responseText =
        response.content[0].type === "text" ? response.content[0].text : "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from Claude");
      }

      const content = JSON.parse(jsonMatch[0]) as GeneratedContent;

      // Store generated content
      await prisma.generatedContent.create({
        data: {
          articleId,
          masterSummary: content.masterSummary,
          seoTitle: content.seoTitle,
          metaDescription: content.metaDescription,
          suggestedHashtags: content.suggestedHashtags || [],
          telegramText: content.telegramText,
          twitterText: content.twitterText,
          instagramCaption: content.instagramCaption,
          facebookPost: content.facebookPost,
          pinterestDescription: content.pinterestDescription,
          websiteArticle: content.websiteArticle,
          pushNotification: content.pushNotification,
          generationTime: Date.now() - startTime,
        },
      });

      await log("CONTENT_GENERATION", "INFO", `Content generated for article ${articleId}`, {
        processingTime: Date.now() - startTime,
      });

      return content;
    } catch (error) {
      await log("CONTENT_GENERATION", "ERROR", `Failed to generate content`, {
        articleId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Generate image prompt based on article
   */
  async generateImagePrompt(
    articleId: string,
    title: string,
    summary: string,
    category: string
  ): Promise<string> {
    try {
      const systemPrompt = `You are an expert at creating detailed, vivid prompts for AI image generation.
Your prompts should be:
- Specific and descriptive
- Positive and inspiring
- Professional quality
- Suitable for news/editorial content
- Visual and engaging
- In English

Create a prompt for an AI image generator (Flux) that would create a high-quality editorial illustration for a news article.`;

      const userPrompt = `
Article Title: ${title}
Category: ${category}
Summary: ${summary}

Generate ONE detailed image prompt (2-3 sentences) for an AI image generator. 
The image should complement the article and be inspiring/positive.
Return ONLY the prompt text, no JSON or additional explanation.`;

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const imagePrompt =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Store image prompt
      await prisma.generatedImage.create({
        data: {
          articleId,
          imagePrompt: imagePrompt.trim(),
          status: "PROMPT_READY",
        },
      });

      return imagePrompt;
    } catch (error) {
      await log("IMAGE_GENERATION", "ERROR", `Failed to generate image prompt`, {
        articleId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Check for duplicate content using AI
   */
  async checkForDuplicates(
    articleId: string,
    title: string,
    description: string
  ): Promise<{ isDuplicate: boolean; similarity: number; duplicateId?: string }> {
    try {
      // First, simple URL/title checks
      const exactMatch = await prisma.article.findFirst({
        where: {
          title: {
            equals: title,
            mode: "insensitive",
          },
          id: { not: articleId },
        },
      });

      if (exactMatch) {
        return {
          isDuplicate: true,
          similarity: 100,
          duplicateId: exactMatch.id,
        };
      }

      // For MVP, use simple similarity algorithm
      // In production, could use Claude for semantic similarity
      const recentArticles = await prisma.article.findMany({
        where: {
          id: { not: articleId },
          fetchedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        select: { id: title: description },
        take: 50,
      });

      let maxSimilarity = 0;
      let similarArticleId: string | undefined;

      for (const article of recentArticles) {
        const similarity = this.calculateSimilarity(title, article.title);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          similarArticleId = article.id;
        }
      }

      return {
        isDuplicate: maxSimilarity > 80,
        similarity: maxSimilarity,
        duplicateId: maxSimilarity > 80 ? similarArticleId : undefined,
      };
    } catch (error) {
      await log("SYSTEM", "ERROR", `Duplicate check failed`, {
        articleId,
        error: error instanceof Error ? error.message : String(error),
      });
      return { isDuplicate: false, similarity: 0 };
    }
  }

  /**
   * Simple string similarity check (Levenshtein-like)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 100;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return ((longer.length - editDistance) / longer.length) * 100;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(s1: string, s2: string): number {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  /**
   * Get prompt template from database
   */
  private async getPromptTemplate(category: string): Promise<string> {
    const template = await prisma.promptTemplate.findFirst({
      where: {
        category: category as any,
        isDefault: true,
      },
    });

    return (
      template?.content ||
      `You are an expert news analyzer. Analyze the given article and return a detailed JSON analysis.`
    );
  }
}

export const aiService = new AIService();
