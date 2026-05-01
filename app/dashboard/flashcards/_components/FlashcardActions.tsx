"use client";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function FlashcardActions({ flipped, handleKnow }: { flipped: boolean; handleKnow: (didKnow: boolean) => void }) {
  return (
    <>{flipped ? (
      <div className="flex justify-center gap-6">
        <button
          onClick={() => handleKnow(false)}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold transition hover:opacity-90 active:scale-95"
          style={{ background: "#f87171" }}
        >
          <ThumbsDown size={18} /> Still Learning
        </button>
        <button
          onClick={() => handleKnow(true)}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold transition hover:opacity-90 active:scale-95"
          style={{ background: "#34d399" }}
        >
          <ThumbsUp size={18} /> Got It!
        </button>
      </div>
    ) : (
      <div className="flex justify-center">
        <p className="text-sm text-gray-400">Click the card to flip it</p>
      </div>
    )}</>
  );
}
