"use client";

import { type LangInfo } from "@/lib/languages";

export function QuizHeader({ langInfo, title, xp, current, total }: {
  langInfo: LangInfo;
  title: string;
  xp: number;
  current: number;
  total: number;
}) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">{langInfo.flag} {langInfo.name} · {title}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Question {current + 1} of {total}</span>
        <span className="text-xs text-blue-500 font-semibold bg-blue-50 px-3 py-1 rounded-full">+{xp} XP on completion</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(current / total) * 100}%`, background: "#4a7cf7" }} />
      </div>
    </div>
  );
}
