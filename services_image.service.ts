// services/image.service.ts

import axios from "axios";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";
import sharp from "sharp";
import fs from "fs";
import path from "path";

interface ImageDimensions {
  telegram: { width: number; height: number };
  twitter: { width: number; height: number };
  instagram: { width: number; height: number };
  facebook: { width: number; height: number };
  pinterest: { width: number; height: number };
  website: { width: number; height: number };
}

const IMAGE_DIMENSIONS: ImageDimensions = {
  telegram: { width: 1080, height: 608 },
  twitter: { width: 1200, height: 675 },
  instagram: { width: 1080, height: 1080 },
  facebook: { width: 1200, height: 628 },
  pinterest: { width: 1000, height: 1500 },
  website: { width: 1200, height: 630 },
};

class ImageService {
  private replicateToken = process.env.REPLICATE_API_TOKEN;
  private outputDir = path.join(process.cwd(), "public", "generated-images");

  constructor() {
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate image using Replicate Flux API
   */
  async generateImage(
    articleId: string,
    imagePrompt: string
  ): Promise<string | null> {
    const startTime = Date.now();

    try {
      await log("IMAGE_GENERATION", "INFO", `Starting image generation`, {
        articleId,
        promptLength: imagePrompt.length,
      });

      // Update status to GENERATING
      await prisma.generatedImage.update(
        {
          where: { articleId },
          data: { status: "GENERATING" },
        },
        { select: { id: true } }
      );

      // Call Replicate API with Flux model
      const response = await axios.post(
        "https://api.replicate.com/v1/predictions",
        {
          version:
            "73a16934d1f20ce3e192f95cb5cf436234a47f47c49e9dfd2e6b7f1e2d23b2f5", // Flux Pro version ID
          input: {
            prompt: imagePrompt,
            num_outputs: 1,
            output_format: "jpg",
            aspect_ratio: "9:5", // Suitable for most platforms
          },
        },
        {
          headers: {
            Authorization: `Token ${this.replicateToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const predictionId = response.data.id;
      let imageUrl: string | null = null;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max wait

      // Poll for completion
      while (attempts < maxAttempts && !imageUrl) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

        const statusResponse = await axios.get(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              Authorization: `Token ${this.replicateToken}`,
            },
          }
        );

        if (statusResponse.data.status === "succeeded") {
          imageUrl = statusResponse.data.output[0];
          break;
        } else if (statusResponse.data.status === "failed") {
          throw new Error(
            `Image generation failed: ${statusResponse.data.error}`
          );
        }

        attempts++;
      }

      if (!imageUrl) {
        throw new Error("Image generation timeout");
      }

      // Download and process image
      const localPath = await this.downloadAndProcessImage(
        articleId,
        imageUrl
      );

      // Generate platform-specific variants
      const variants = await this.generatePlatformVariants(
        articleId,
        localPath
      );

      // Update database
      await prisma.generatedImage.update({
        where: { articleId },
        data: {
          imageUrl,
          localPath,
          status: "GENERATED",
          telegramUrl: variants.telegram,
          twitterUrl: variants.twitter,
          instagramUrl: variants.instagram,
          facebookUrl: variants.facebook,
          pinterestUrl: variants.pinterest,
          websiteUrl: variants.website,
          generationTime: Date.now() - startTime,
        },
      });

      await log("IMAGE_GENERATION", "INFO", `Image generated successfully`, {
        articleId,
        processingTime: Date.now() - startTime,
      });

      return imageUrl;
    } catch (error) {
      await prisma.generatedImage.update({
        where: { articleId },
        data: {
          status: "FAILED",
          failureReason:
            error instanceof Error ? error.message : String(error),
          retryCount: {
            increment: 1,
          },
        },
      });

      await log("IMAGE_GENERATION", "ERROR", `Failed to generate image`, {
        articleId,
        error: error instanceof Error ? error.message : String(error),
      });

      return null;
    }
  }

  /**
   * Download image from URL and save locally
   */
  private async downloadAndProcessImage(
    articleId: string,
    imageUrl: string
  ): Promise<string> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      const filename = `${articleId}-main.jpg`;
      const filepath = path.join(this.outputDir, filename);

      // Optimize image with sharp
      await sharp(response.data)
        .resize(1200, 630, {
          fit: "cover",
          position: "center",
        })
        .toFile(filepath);

      return `/generated-images/${filename}`;
    } catch (error) {
      throw new Error(
        `Failed to download/process image: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Generate platform-specific image variants
   */
  private async generatePlatformVariants(
    articleId: string,
    mainImagePath: string
  ): Promise<Record<string, string>> {
    const variants: Record<string, string> = {};

    try {
      const mainImageBuffer = fs.readFileSync(
        path.join(process.cwd(), "public", mainImagePath)
      );

      for (const [platform, dimensions] of Object.entries(IMAGE_DIMENSIONS)) {
        const filename = `${articleId}-${platform}.jpg`;
        const filepath = path.join(this.outputDir, filename);

        await sharp(mainImageBuffer)
          .resize(dimensions.width, dimensions.height, {
            fit: "cover",
            position: "center",
          })
          .toFile(filepath);

        variants[platform] = `/generated-images/${filename}`;
      }

      await log(
        "IMAGE_GENERATION",
        "INFO",
        `Generated ${Object.keys(variants).length} platform variants`,
        { articleId }
      );
    } catch (error) {
      await log("IMAGE_GENERATION", "ERROR", `Failed to generate variants`, {
        articleId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return variants;
  }

  /**
   * Regenerate image for an article
   */
  async regenerateImage(articleId: string): Promise<string | null> {
    try {
      const image = await prisma.generatedImage.findUnique({
        where: { articleId },
      });

      if (!image || !image.imagePrompt) {
        throw new Error("No image or prompt found");
      }

      return await this.generateImage(articleId, image.imagePrompt);
    } catch (error) {
      await log("IMAGE_GENERATION", "ERROR", `Failed to regenerate image`, {
        articleId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byPlatform: Record<string, number>;
  }> {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      byPlatform: {
        telegram: 0,
        twitter: 0,
        instagram: 0,
        facebook: 0,
        pinterest: 0,
        website: 0,
      } as Record<string, number>,
    };

    try {
      if (!fs.existsSync(this.outputDir)) return stats;

      const files = fs.readdirSync(this.outputDir);

      for (const file of files) {
        const filepath = path.join(this.outputDir, file);
        const stat = fs.statSync(filepath);

        stats.totalFiles++;
        stats.totalSize += stat.size;

        // Count by platform
        for (const platform of Object.keys(stats.byPlatform)) {
          if (file.includes(platform)) {
            stats.byPlatform[platform]++;
          }
        }
      }
    } catch (error) {
      await log("SYSTEM", "ERROR", `Failed to get storage stats`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return stats;
  }

  /**
   * Clean up old/unused images
   */
  async cleanupOldImages(daysOld: number = 30): Promise<number> {
    let deletedCount = 0;

    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

      const oldImages = await prisma.generatedImage.findMany({
        where: {
          createdAt: { lt: cutoffDate },
          status: "FAILED",
        },
      });

      for (const image of oldImages) {
        if (image.localPath) {
          const filepath = path.join(
            process.cwd(),
            "public",
            image.localPath
          );
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            deletedCount++;
          }
        }
      }

      await log("SYSTEM", "INFO", `Cleaned up ${deletedCount} old images`);
    } catch (error) {
      await log("SYSTEM", "ERROR", `Failed to cleanup old images`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return deletedCount;
  }
}

export const imageService = new ImageService();
