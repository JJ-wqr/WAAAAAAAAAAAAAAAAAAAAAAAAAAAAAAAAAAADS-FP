"use client";

import { Sparkles, Loader2 } from "lucide-react";

type Level = "beginner" | "intermediate" | "advanced";

const LEVEL_STYLES: Record<Level, { label: string; color: string; bg: string }> = {
  beginner: { label: "Beginner", color: "#34d399", bg: "#ecfdf5" },
  intermediate: { label: "Intermediate", color: "#4a7cf7", bg: "#eef2ff" },
  advanced: { label: "Advanced", color: "#a78bfa", bg: "#f5f3ff" },
};

export function AdaptiveDifficultyCard({
  loading,
  level,
  recommendation,
  recentScores,
  computedRecommendation,
}: {
  loading: boolean;
  level: Level | null;
  recommendation: string | null;
  recentScores?: number[] | null;
  computedRecommendation?: string | null;
}) {
  if (!loading && !recommendation && !computedRecommendation) return null;

  const style = LEVEL_STYLES[level ?? "beginner"];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: style.bg }}>
        {loading ? (
          <Loader2 size={20} className="animate-spin" style={{ color: style.color }} />
        ) : (
          <Sparkles size={20} style={{ color: style.color }} />
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">AI Recommendation</p>
        {loading ? (
          <p className="text-sm text-gray-400 mt-1">Analyzing your recent performance...</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              Suggested level: <span style={{ color: style.color }}>{style.label}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{recommendation ?? computedRecommendation}</p>
            {recentScores && recentScores.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">Recent scores: {recentScores.join("%, ")}%</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
