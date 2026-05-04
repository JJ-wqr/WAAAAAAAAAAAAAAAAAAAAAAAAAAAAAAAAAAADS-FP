"use client";

import SpeechButton from "@/components/SpeechButton";
import { masteryColor } from "@/lib/utils";

export function VocabularyWordCard({ word, speechLang }: { word: any; speechLang: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-gray-800">{word.word}</p>
          <p className="text-xs text-gray-400 mt-0.5">{word.romaji}</p>
        </div>
        <SpeechButton text={word.word} lang={speechLang} />
      </div>
      <p className="text-sm text-gray-600 mb-3">{word.meaning}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">{word.category}</span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${word.mastery}%`, background: masteryColor(word.mastery) }}
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: masteryColor(word.mastery) }}>
            {word.mastery}%
          </span>
        </div>
      </div>
    </div>
  );
}
