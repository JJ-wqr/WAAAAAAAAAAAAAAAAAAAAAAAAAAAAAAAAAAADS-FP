"use client";
import { RotateCcw, ChevronRight, Trophy } from "lucide-react";

export function QuizResultCard({ finalScore, pct, xp, saveError, router, onRetry }: {
  finalScore: number;
  pct: number;
  xp: number;
  saveError: string | null;
  router: any;
  onRetry: () => void;
}) {
  return (
    <div className="p-8 flex items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-5">
          <Trophy size={36} className="text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Lesson Complete!</h2>
        <p className="text-gray-500 text-sm mb-6">You completed the lesson.</p>
        {saveError && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-left">
            <strong>Save failed:</strong> {saveError}
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-blue-500">{pct}%</p>
            <p className="text-xs text-gray-500 mt-1">Score</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-green-500">{finalScore}/{xp}</p>
            <p className="text-xs text-gray-500 mt-1">Correct</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-purple-500">+{xp}</p>
            <p className="text-xs text-gray-500 mt-1">XP Earned</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} /> Retry
          </button>
          <button
            onClick={() => router.push("/dashboard/lessons")}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: "#4a7cf7" }}
          >
            Back to Lessons <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
