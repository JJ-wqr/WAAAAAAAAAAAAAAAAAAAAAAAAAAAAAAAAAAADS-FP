"use client";
import { useState, useEffect } from "react";
import { User, Mail, Globe, Bell, Shield, Palette, ChevronRight, Flame, Zap, BookOpen, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/authprovider";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const achievements = [
  { icon: "🔥", title: "Week Warrior", desc: "7-day streak", key: "streak", threshold: 7 },
  { icon: "📚", title: "Word Hoarder", desc: "1000 words learned", key: "wordsLearned", threshold: 1000 },
  { icon: "⚡", title: "XP Machine", desc: "5000 XP earned", key: "xp", threshold: 5000 },
  { icon: "🎯", title: "Lesson Master", desc: "10 lessons done", key: "lessonsCompleted", threshold: 10 },
  { icon: "🌍", title: "Polyglot", desc: "Learn 3 languages", key: null, threshold: null },
  { icon: "👑", title: "Top Learner", desc: "Reach #1 leaderboard", key: null, threshold: null },
];

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile" },
      { icon: Mail, label: "Change Email" },
      { icon: Shield, label: "Change Password" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Globe, label: "Interface Language" },
      { icon: Bell, label: "Notifications" },
      { icon: Palette, label: "Theme" },
    ],
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stats" | "achievements" | "settings">("stats");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) setUserData(snap.data());
    });
    return () => unsub();
  }, [user]);

  const displayLanguages: { flag: string; name: string; level: string; xp: number }[] =
    userData?.languages ?? [
      { flag: "🇯🇵", name: "Japanese", level: "Beginner", xp: 0 },
      { flag: "🇪🇸", name: "Spanish", level: "Beginner", xp: 0 },
      { flag: "🇫🇷", name: "French", level: "Beginner", xp: 0 },
    ];

  const initials = (user?.displayName ?? user?.email ?? "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="p-8 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
              style={{ background: "linear-gradient(135deg, #4a7cf7, #7c3aed)" }}
            >
              {initials}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800">{user?.displayName ?? userData?.name ?? "User"}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {displayLanguages.map((l) => (
                <span key={l.name} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                  {l.flag} {l.name} · {l.level}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Streak", value: String(userData?.streak ?? 0), icon: Flame, color: "#ff6b35" },
              { label: "Total XP", value: (userData?.xp ?? 0).toLocaleString(), icon: Zap, color: "#4a7cf7" },
              { label: "Words", value: String(userData?.wordsLearned ?? 0), icon: BookOpen, color: "#34d399" },
              { label: "Lessons", value: String(userData?.lessonsCompleted ?? 0), icon: CheckCircle2, color: "#a78bfa" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="text-center bg-gray-50 rounded-xl p-3 min-w-[80px]">
                <Icon size={16} style={{ color }} className="mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-800 leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["stats", "achievements", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition ${
              activeTab === tab ? "text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
            style={activeTab === tab ? { background: "#4a7cf7" } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-5">Language Progress</h3>
            <div className="space-y-5">
              {displayLanguages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-4">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">{lang.name}</span>
                      <span className="text-gray-400 text-xs">{lang.level} · {lang.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min((lang.xp / 1000) * 100, 100)}%`, background: "#4a7cf7" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-5">Weekly Activity</h3>
            <div className="flex items-end justify-between gap-1 h-24">
              {[40, 70, 55, 90, 65, 80, 45].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm"
                    style={{ height: `${h}%`, background: i === 6 ? "#e5e7eb" : "#4a7cf7", opacity: i === 6 ? 0.5 : 1 }}
                  />
                  <span className="text-xs text-gray-400">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-3 gap-4">
          {achievements.map(({ icon, title, desc, key, threshold }) => {
            const earned = key && threshold ? (userData?.[key] ?? 0) >= threshold : false;
            return (
              <div
                key={title}
                className={`bg-white rounded-2xl p-5 shadow-sm border text-center transition ${
                  earned ? "border-gray-100" : "border-gray-100 opacity-50 grayscale"
                }`}
              >
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
          })}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-4 max-w-lg">
          {settingsSections.map(({ title, items }) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Icon size={15} className="text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            <div className="px-6 py-3 border-b border-red-50">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Account</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition text-left"
            >
              <span className="text-sm font-medium text-red-500">Log Out</span>
              <ChevronRight size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
