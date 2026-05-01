"use client";

import { Crown, Flame, Medal, Zap } from "lucide-react";

/**
 * Renders medal/crown icon based on rank position
 */
function BadgeIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={18} style={{ color: "#f59e0b" }} />;
  if (rank === 2) return <Medal size={18} style={{ color: "#94a3b8" }} />;
  if (rank === 3) return <Medal size={18} style={{ color: "#cd7c54" }} />;
  return null;
}

/**
 * Displays ranked badge with number for any position
 */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#f59e0b" }}>1</div>
  );
  if (rank === 2) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#94a3b8" }}>2</div>
  );
  if (rank === 3) return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#cd7c54" }}>3</div>
  );
  return <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-400">#{rank}</span>;
}

/**
 * Circular avatar with initial letter from user name
 */
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

/**
 * Individual leaderboard row displaying user rank, stats, and metadata
 */
export function LeaderboardRow({ u, rank, isMe }: { u: any; rank: number; isMe: boolean }) {
  const flag = u.languages?.[0]?.flag ?? "🌐";
  return (
    <div className={`flex items-center gap-4 px-6 py-4 transition ${isMe ? "bg-blue-50" : "hover:bg-gray-50"}`}>
      <div className="flex items-center gap-1">
        <RankBadge rank={rank} />
        {rank <= 3 && <BadgeIcon rank={rank} />}
      </div>
      <Avatar
        name={u.name}
        size="w-10 h-10 text-sm"
        bg={isMe ? "#4a7cf7" : "#94a3b8"}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold ${isMe ? "text-blue-600" : "text-gray-700"}`}>
            {u.name}{isMe ? " (You)" : ""}
          </p>
          {isMe && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>}
        </div>
        <p className="text-xs text-gray-400">{flag} Learning</p>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1 text-orange-500">
          <Flame size={14} />
          <span className="font-semibold">{u.streak}</span>
        </div>
        <div className="flex items-center gap-1 text-blue-500">
          <Zap size={14} />
          <span className="font-semibold">{u.xp.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
