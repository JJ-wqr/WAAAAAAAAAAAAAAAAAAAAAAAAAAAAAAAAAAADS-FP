"use client";
import { useState, useEffect } from "react";
import { Trophy, Flame, Zap, Crown, Medal } from "lucide-react";
import { useAuth } from "@/components/authprovider";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

type LeaderUser = {
  uid: string;
  name: string;
  xp: number;
  streak: number;
  languages?: { flag: string }[];
};

const timeFilters = ["This Week", "This Month", "All Time"];

function BadgeIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={18} style={{ color: "#f59e0b" }} />;
  if (rank === 2) return <Medal size={18} style={{ color: "#94a3b8" }} />;
  if (rank === 3) return <Medal size={18} style={{ color: "#cd7c54" }} />;
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

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("This Week");
  const [users, setUsers] = useState<LeaderUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("xp", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data: LeaderUser[] = snap.docs.map((doc) => ({
        uid: doc.id,
        name: doc.data().name ?? doc.data().email ?? "User",
        xp: doc.data().xp ?? 0,
        streak: doc.data().streak ?? 0,
        languages: doc.data().languages,
      }));
      setUsers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const top3 = users.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  const podiumColors = ["#94a3b8", "#4a7cf7", "#cd7c54"];
  const podiumBorders = ["", "border-4 border-yellow-400", ""];
  const podiumSizes = ["w-16 h-16 text-xl", "w-20 h-20 text-2xl", "w-16 h-16 text-xl"];
  const podiumBarHeights = ["h-16", "h-24", "h-10"];
  const podiumBarColors = ["#e2e8f0", "#fef3c7", "#fed7aa"];
  const podiumRanks = [2, 1, 3];
  const podiumRankColors = ["bg-gray-200 text-gray-600", "bg-yellow-400 text-white", "bg-orange-200 text-orange-700"];
  const podiumMargins = ["", "-mb-4", ""];

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

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 text-sm">
          Loading leaderboard...
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-end justify-center gap-6">
                {podiumOrder.map((u, i) => {
                  const rank = podiumRanks[i];
                  return (
                    <div key={u.uid} className={`flex flex-col items-center gap-2 ${podiumMargins[i]}`}>
                      {rank === 1 && <div className="mb-1"><Crown size={24} style={{ color: "#f59e0b" }} /></div>}
                      <div className="relative">
                        <Avatar name={u.name} size={podiumSizes[i]} border={podiumBorders[i]} bg={podiumColors[i]} />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${podiumRankColors[i]}`}>
                          {rank}
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{u.name.split(" ")[0]}</p>
                      <p className="text-xs text-gray-400">{u.xp.toLocaleString()} XP</p>
                      <div className={`w-24 ${podiumBarHeights[i]} rounded-t-xl flex items-center justify-center`} style={{ background: podiumBarColors[i] }}>
                        {rank === 1 && <Trophy size={28} style={{ color: "#f59e0b" }} />}
                        {rank === 2 && <Medal size={20} style={{ color: "#94a3b8" }} />}
                        {rank === 3 && <Medal size={16} style={{ color: "#cd7c54" }} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Rankings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {users.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">No users yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {users.map((u, idx) => {
                  const rank = idx + 1;
                  const isMe = u.uid === user?.uid;
                  const flag = u.languages?.[0]?.flag ?? "🌐";
                  return (
                    <div
                      key={u.uid}
                      className={`flex items-center gap-4 px-6 py-4 transition ${isMe ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    >
                      <RankBadge rank={rank} />
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
                          <BadgeIcon rank={rank} />
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
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
