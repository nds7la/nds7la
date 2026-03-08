// app/api/admin/fetch-rss/route.ts

import { NextRequest, NextResponse } from "next/server";
import { rssService } from "@/services/rss.service";
import { log } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await log("RSS_FETCH", "INFO", "Manual RSS fetch initiated via API");

    await rssService.fetchAllSources();

    await log("RSS_FETCH", "INFO", "Manual RSS fetch completed");

    return NextResponse.json({
      success: true,
      message: "RSS fetch completed successfully",
    });
  } catch (error) {
    await log("RSS_FETCH", "ERROR", "RSS fetch failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
