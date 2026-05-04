"use client";

import { CheckCircle2 } from "lucide-react";

export function AchievementCard({ icon, title, desc, earned }: { icon: string; title: string; desc: string; earned: boolean }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border text-center transition ${earned ? "border-gray-100" : "border-gray-100 opacity-50 grayscale"}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 ${earned ? "bg-yellow-50" : "bg-gray-50"}`}>
        {icon}
      </div>
      <p className="font-semibold text-gray-800 text-sm">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
      {earned && (
        <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-500 font-medium">
          <CheckCircle2 size={12} /> Earned
        </span>
      )}
    </div>
  );
}
