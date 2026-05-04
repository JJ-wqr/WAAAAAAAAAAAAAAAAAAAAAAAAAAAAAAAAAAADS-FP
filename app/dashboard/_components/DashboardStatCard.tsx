"use client";

import { Flame, Zap, BookOpen, CheckCircle2 } from "lucide-react";

export function DashboardStatCards({ userData }: { userData: any }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[
        { label: "Day Streak", value: String(userData?.streak ?? 0), sub: "Keep it up!", icon: Flame, color: "#ff6b35", bg: "#fff3ee" },
        { label: "Total XP", value: (userData?.xp ?? 0).toLocaleString(), sub: "Earn more by learning", icon: Zap, color: "#4a7cf7", bg: "#eef2ff" },
        { label: "Words Learned", value: String(userData?.wordsLearned ?? 0), sub: "Keep learning!", icon: BookOpen, color: "#34d399", bg: "#ecfdf5" },
        { label: "Lessons Done", value: String(userData?.lessonsCompleted ?? 0), sub: "Great progress", icon: CheckCircle2, color: "#a78bfa", bg: "#f5f3ff" },
      ].map(({ label, value, sub, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
            <Icon size={22} style={{ color }} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
