"use client";

import { Crown, Medal, Trophy } from "lucide-react";

// Renders medal/crown icon based on rank position
function BadgeIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={18} style={{ color: "#f59e0b" }} />;
  if (rank === 2) return <Medal size={18} style={{ color: "#94a3b8" }} />;
  if (rank === 3) return <Medal size={18} style={{ color: "#cd7c54" }} />;
  return null;
}

// Circular avatar with initial letter from user name
function Avatar({ name, size, border, bg }: { name: string; size: string; border?: string; bg: string }) {
  const initial = (name ?? "?")[0].toUpperCase();
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-white font-bold ${border ?? ""}`}
      style={{ background: bg }}
    >
      {initial}
    </div>
  );
}

// Displays top 3 users in a visual podium with ranked positions
export function LeaderboardPodium({ top3, podiumOrder, podiumBorders, podiumSizes, podiumBarHeights, podiumBarColors, podiumRanks, podiumRankColors, podiumMargins }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-end justify-center gap-6">
        {podiumOrder.map((u: any, i: number) => {
          const rank = podiumRanks[i];
          return (
            <div key={u.uid} className={`flex flex-col items-center gap-2 ${podiumMargins[i]}`}>
              {rank === 1 && <div className="mb-1"><Crown size={24} style={{ color: "#f59e0b" }} /></div>}
              <div className="relative">
                <Avatar name={u.name} size={podiumSizes[i]} border={podiumBorders[i]} bg={podiumBarColors[i]} />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${podiumRankColors[i]}`}>
                  {rank}
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700">{u.name.split(" ")[0]}</p>
              <p className="text-xs text-gray-400">{u.xp.toLocaleString()} XP</p>
              <div className={`w-24 ${podiumBarHeights[i]} rounded-t-xl flex items-center justify-center`} style={{ background: podiumBarColors[i] }}>
                {rank === 1 && <Trophy size={28} style={{ color: "#f59e0b" }} />}
                {rank === 2 && <BadgeIcon rank={rank} />}
                {rank === 3 && <BadgeIcon rank={rank} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
