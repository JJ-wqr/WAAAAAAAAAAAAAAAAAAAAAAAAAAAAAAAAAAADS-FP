"use client";
import { Globe } from "lucide-react";

export function DashboardLanguagesCard({ displayLanguages }: { displayLanguages: Array<{ code: string; flag: string; name: string; xp: number; level: string; maxXp: number }> }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
        <Globe size={18} className="text-blue-500" /> My Languages
      </h2>
      <div className="space-y-4">
        {displayLanguages.map((lang) => (
          <div key={lang.code} className="flex items-center gap-3">
            <span className="text-2xl">{lang.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{lang.name}</span>
                <span className="text-xs text-gray-400">{lang.level}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(lang.xp / lang.maxXp) * 100}%`, background: "#4a7cf7" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{lang.xp.toLocaleString()} / {lang.maxXp.toLocaleString()} XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
