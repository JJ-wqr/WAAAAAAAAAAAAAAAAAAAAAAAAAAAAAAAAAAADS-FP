"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { useAuth } from "@/components/authprovider";
import { db } from "@/lib/firebase";

import { TimeFilterBar } from "./_components/TimeFilterBar";
import { LeaderboardPodium } from "./_components/PodiumSection";
import { LeaderboardRow } from "./_components/LeaderboardRow";

type LeaderUser = {
  uid: string;
  name: string;
  xp: number;
  streak: number;
  languages?: { flag: string }[];
};

const timeFilters = ["This Week", "This Month", "All Time"];

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
      <TimeFilterBar filters={timeFilters} filter={filter} setFilter={setFilter} />

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 text-sm">
          Loading leaderboard...
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <LeaderboardPodium
              top3={top3}
              podiumOrder={podiumOrder}
              podiumBorders={podiumBorders}
              podiumSizes={podiumSizes}
              podiumBarHeights={podiumBarHeights}
              podiumBarColors={podiumBarColors}
              podiumRanks={podiumRanks}
              podiumRankColors={podiumRankColors}
              podiumMargins={podiumMargins}
            />
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
                  return (
                    <LeaderboardRow key={u.uid} u={u} rank={rank} isMe={isMe} />
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
