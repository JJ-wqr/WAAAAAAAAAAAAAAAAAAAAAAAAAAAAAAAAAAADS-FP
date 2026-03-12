"use client";
import { useState } from "react";
import { Trophy, Flame, Zap, Crown, Medal } from "lucide-react";

const users = [
  { rank: 1, name: "Yuki T.", avatar: "Y", xp: 12400, streak: 67, lang: "🇯🇵", badge: "crown" },
  { rank: 2, name: "Carlos M.", avatar: "C", xp: 11200, streak: 45, lang: "🇪🇸", badge: "silver" },
  { rank: 3, name: "Sophie L.", avatar: "S", xp: 10850, streak: 38, lang: "🇫🇷", badge: "bronze" },
  { rank: 4, name: "Alex (You)", avatar: "A", xp: 7590, streak: 24, lang: "🇯🇵", badge: null, isMe: true },
  { rank: 5, name: "Hana K.", avatar: "H", xp: 7100, streak: 21, lang: "🇰🇷", badge: null },
  { rank: 6, name: "Marco P.", avatar: "M", xp: 6800, streak: 18, lang: "🇮🇹", badge: null },
  { rank: 7, name: "Aisha B.", avatar: "A", xp: 6500, streak: 15, lang: "🇩🇪", badge: null },
  { rank: 8, name: "Lena S.", avatar: "L", xp: 5900, streak: 12, lang: "🇷🇺", badge: null },
  { rank: 9, name: "Ji-ho P.", avatar: "J", xp: 5200, streak: 9, lang: "🇨🇳", badge: null },
  { rank: 10, name: "Tom W.", avatar: "T", xp: 4800, streak: 7, lang: "🇧🇷", badge: null },
];

const timeFilters = ["This Week", "This Month", "All Time"];

function BadgeIcon({ badge }: { badge: string | null }) {
  if (badge === "crown") return <Crown size={18} style={{ color: "#f59e0b" }} />;
  if (badge === "silver") return <Medal size={18} style={{ color: "#94a3b8" }} />;
  if (badge === "bronze") return <Medal size={18} style={{ color: "#cd7c54" }} />;
  return null;
}

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

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("This Week");
  const top3 = users.slice(0, 3);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
        <p className="text-gray-500 text-sm mt-1">Compete with learners around the world.</p>
      </div>

      {/* Time filters */}
      <div className="flex gap-2">
        {timeFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === f ? "text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
            style={filter === f ? { background: "#4a7cf7" } : {}}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-end justify-center gap-6">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: "#94a3b8" }}>
                {top3[1].avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">2</div>
            </div>
            <p className="text-sm font-semibold text-gray-700">{top3[1].name}</p>
            <p className="text-xs text-gray-400">{top3[1].xp.toLocaleString()} XP</p>
            <div className="w-24 h-16 rounded-t-xl flex items-center justify-center" style={{ background: "#e2e8f0" }}>
              <Medal size={20} style={{ color: "#94a3b8" }} />
            </div>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center gap-2 -mb-4">
            <div className="mb-1"><Crown size={24} style={{ color: "#f59e0b" }} /></div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-yellow-400" style={{ background: "#4a7cf7" }}>
                {top3[0].avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-white">1</div>
            </div>
            <p className="text-sm font-semibold text-gray-700">{top3[0].name}</p>
            <p className="text-xs text-gray-400">{top3[0].xp.toLocaleString()} XP</p>
            <div className="w-24 h-24 rounded-t-xl flex items-center justify-center" style={{ background: "#fef3c7" }}>
              <Trophy size={28} style={{ color: "#f59e0b" }} />
            </div>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: "#cd7c54" }}>
                {top3[2].avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">3</div>
            </div>
            <p className="text-sm font-semibold text-gray-700">{top3[2].name}</p>
            <p className="text-xs text-gray-400">{top3[2].xp.toLocaleString()} XP</p>
            <div className="w-24 h-10 rounded-t-xl flex items-center justify-center" style={{ background: "#fed7aa" }}>
              <Medal size={16} style={{ color: "#cd7c54" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Full Rankings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {users.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center gap-4 px-6 py-4 transition ${user.isMe ? "bg-blue-50" : "hover:bg-gray-50"}`}
            >
              <RankBadge rank={user.rank} />
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: user.isMe ? "#4a7cf7" : "#94a3b8" }}
              >
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${user.isMe ? "text-blue-600" : "text-gray-700"}`}>
                    {user.name}
                  </p>
                  {user.isMe && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>}
                  <BadgeIcon badge={user.badge} />
                </div>
                <p className="text-xs text-gray-400">{user.lang} Learning</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame size={14} />
                  <span className="font-semibold">{user.streak}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-500">
                  <Zap size={14} />
                  <span className="font-semibold">{user.xp.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
