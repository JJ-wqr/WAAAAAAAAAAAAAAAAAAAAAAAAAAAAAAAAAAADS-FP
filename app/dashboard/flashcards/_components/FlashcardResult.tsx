"use client";
import { CheckCircle2, RotateCcw } from "lucide-react";

export function FlashcardResult({ known, unknown, restart }: { known: number; unknown: number; restart: () => void }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Complete!</h2>
        <p className="text-gray-500 mb-6">You reviewed {known + unknown} cards.</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-green-500">{known}</p>
            <p className="text-sm text-gray-500">Knew it</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-red-400">{unknown}</p>
            <p className="text-sm text-gray-500">Need practice</p>
          </div>
        </div>
        <button
          onClick={restart}
          className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: "#4a7cf7" }}
        >
          <RotateCcw size={16} /> Practice Again
        </button>
      </div>
    </div>
  );
}
