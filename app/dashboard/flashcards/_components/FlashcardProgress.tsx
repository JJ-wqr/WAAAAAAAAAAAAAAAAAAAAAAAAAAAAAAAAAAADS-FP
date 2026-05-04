"use client";

import { ThumbsUp, ThumbsDown, Zap } from "lucide-react";

export function FlashcardProgress({ index, total, known, unknown }: { index: number; total: number; known: number; unknown: number }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">Progress</span>
          <span className="text-blue-500 font-semibold">{index} / {total}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(index / total) * 100}%`, background: "#4a7cf7" }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-500 font-semibold flex items-center gap-1">
          <ThumbsUp size={14} /> {known}
        </span>
        <span className="text-red-400 font-semibold flex items-center gap-1">
          <ThumbsDown size={14} /> {unknown}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs text-blue-400 font-semibold bg-blue-50 px-3 py-1.5 rounded-full">
        <Zap size={12} /> +15 XP
      </div>
    </div>
  );
}
