// lib/logger.ts

import { prisma } from "./prisma";

export type LogCategory =
  | "RSS_FETCH"
  | "AI_ANALYSIS"
  | "CONTENT_GENERATION"
  | "IMAGE_GENERATION"
  | "PUBLISHING"
  | "PLATFORM_CONNECTION"
  | "SYSTEM"
  | "ERROR";

export type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
};

const levelColors: Record<LogLevel, string> = {
  ERROR: colors.red,
  WARNING: colors.yellow,
  INFO: colors.green,
  DEBUG: colors.gray,
};

/**
 * Log to database and console
 */
export async function log(
  category: LogCategory,
  level: LogLevel,
  message: string,
  details?: Record<string, any>
): Promise<void> {
  const timestamp = new Date().toISOString();
  const levelColor = levelColors[level];

  // Console output
  console.log(
    `${levelColor}[${timestamp}] ${level} - ${category}: ${message}${colors.reset}`
  );

  if (details) {
    console.log(`  Details: ${JSON.stringify(details, null, 2)}`);
  }

  // Database logging
  try {
    await prisma.log.create({
      data: {
        category: category as any,
        level: level as any,
        message,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error(`Failed to write log to database: ${error}`);
  }
}

/**
 * Get logs from database
 */
export async function getLogs(
  filters?: {
    category?: LogCategory;
    level?: LogLevel;
    limit?: number;
    hours?: number;
  }
): Promise<any[]> {
  const hoursAgo = filters?.hours
    ? new Date(Date.now() - filters.hours * 60 * 60 * 1000)
    : new Date(Date.now() - 24 * 60 * 60 * 1000);

  return prisma.log.findMany({
    where: {
      category: filters?.category as any,
      level: filters?.level as any,
      createdAt: { gte: hoursAgo },
    },
    orderBy: { createdAt: "desc" },
    take: filters?.limit || 100,
  });
}

/**
 * Get error logs only
 */
export async function getErrors(hoursAgo: number = 24): Promise<any[]> {
  return getLogs({
    level: "ERROR",
    hours: hoursAgo,
  });
}

/**
 * Clear old logs
 */
export async function clearOldLogs(daysOld: number = 30): Promise<number> {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

  const result = await prisma.log.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
    },
  });

  return result.count;
}
