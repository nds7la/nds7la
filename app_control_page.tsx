// app/control/page.tsx

"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  RefreshCw,
  Zap,
  ImageIcon,
  Send,
  PauseCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  totalSources: number;
  totalArticlesInbox: number;
  articlesPending: number;
  articlesApproved: number;
  articlesRejected: number;
  postsScheduled: number;
  postsPublished: number;
  imageFailures: number;
  llmFailures: number;
  avgProcessingTime: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRss = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/fetch-rss", { method: "POST" });
      if (res.ok) {
        fetchStats();
        alert("RSS fetch completed!");
      }
    } catch (error) {
      console.error("Failed to fetch RSS:", error);
      alert("Error fetching RSS");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessAI = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/process-ai", { method: "POST" });
      if (res.ok) {
        fetchStats();
        alert("AI processing completed!");
      }
    } catch (error) {
      console.error("Failed to process with AI:", error);
      alert("Error processing with AI");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateImages = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/generate-images", {
        method: "POST",
      });
      if (res.ok) {
        fetchStats();
        alert("Image generation completed!");
      }
    } catch (error) {
      console.error("Failed to generate images:", error);
      alert("Error generating images");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/publish-scheduled", {
        method: "POST",
      });
      if (res.ok) {
        fetchStats();
        alert("Publishing completed!");
      }
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("Error publishing");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Your newsroom at a glance</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={handleFetchRss}
          disabled={isProcessing}
          className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className="w-6 h-6 text-blue-600" />
          <span className="font-medium text-blue-900">Fetch RSS</span>
        </button>

        <button
          onClick={handleProcessAI}
          disabled={isProcessing}
          className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg transition disabled:opacity-50"
        >
          <Zap className="w-6 h-6 text-purple-600" />
          <span className="font-medium text-purple-900">Process AI</span>
        </button>

        <button
          onClick={handleGenerateImages}
          disabled={isProcessing}
          className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg transition disabled:opacity-50"
        >
          <ImageIcon className="w-6 h-6 text-green-600" />
          <span className="font-medium text-green-900">Generate Images</span>
        </button>

        <button
          onClick={handlePublish}
          disabled={isProcessing}
          className="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-lg transition disabled:opacity-50"
        >
          <Send className="w-6 h-6 text-orange-600" />
          <span className="font-medium text-orange-900">Publish</span>
        </button>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* RSS Sources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">RSS Sources</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalSources || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">sources configured</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Today's Articles */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Articles</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalArticlesInbox || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">incoming articles</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.articlesPending || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">awaiting approval</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.articlesApproved || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">ready to publish</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.postsPublished || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">total posts</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Processing Errors */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-3xl font-bold text-red-600">
                {(stats?.imageFailures || 0) + (stats?.llmFailures || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">failures today</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>✓ Last RSS fetch: 2 minutes ago</p>
          <p>✓ Last AI process: 15 minutes ago</p>
          <p>✓ Last image generation: 30 minutes ago</p>
          <p>✓ Last publication: 1 hour ago</p>
        </div>
      </div>
    </div>
  );
}
