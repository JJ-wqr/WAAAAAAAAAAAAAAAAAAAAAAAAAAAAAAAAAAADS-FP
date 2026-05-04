"use client";

import { TrendingUp, Target, CheckCircle2 } from "lucide-react";

export function DashboardGoalsCard({ displaySkills, selectedLang, displayDailyGoals, goalsDone, goalsTotal }: {
  displaySkills: Array<{ name: string; value: number; color: string }>;
  selectedLang: { flag: string; name: string };
  displayDailyGoals: Array<{ label: string; done: boolean }>;
  goalsDone: number;
  goalsTotal: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" /> Skill Breakdown
          </h2>
          <span className="text-xs text-blue-500 font-medium px-3 py-1 bg-blue-50 rounded-full">
            {selectedLang.flag} {selectedLang.name}
          </span>
        </div>
        <div className="space-y-5">
          {displaySkills.map(({ name, value, color }) => (
            <div key={name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{name}</span>
                <span className="font-semibold" style={{ color }}>{value}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${value}%`, background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
          <Target size={18} className="text-blue-500" /> Daily Goals
        </h2>
        <div className="space-y-3 mb-5">
          {displayDailyGoals.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: done ? "#34d399" : "#e5e7eb" }}
              >
                {done && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <span className={`text-sm ${done ? "line-through text-gray-400" : "text-gray-700"}`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="38" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="48" cy="48" r="38" fill="none" stroke="#4a7cf7" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 38}`}
                strokeDashoffset={`${2 * Math.PI * 38 * (1 - goalsDone / goalsTotal)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-800">{goalsDone}/{goalsTotal}</span>
              <span className="text-xs text-gray-400">done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
