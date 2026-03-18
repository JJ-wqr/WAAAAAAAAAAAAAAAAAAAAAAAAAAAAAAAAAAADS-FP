"use client";

import { useAuth } from "@/components/authprovider";
import { useEffect, useState } from "react";
import {
  Flame,
  Zap,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Globe,
  Star,
  Clock,
  Target,
} from "lucide-react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const LANG_OPTIONS = [
  { code: "ja", flag: "🇯🇵", name: "Japanese" },
  { code: "es", flag: "🇪🇸", name: "Spanish" },
  { code: "fr", flag: "🇫🇷", name: "French" },
];

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "Just now" : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedLangCode, setSelectedLangCode] = useState("ja");
  const [userData, setUserData] = useState<any>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const missing: Record<string, unknown> = {};
        if (!data.skills)
          missing.skills = { reading: 0, writing: 0, listening: 0, speaking: 0 };
        if (!data.dailyGoals)
          missing.dailyGoals = { completedLesson: false, reviewedFlashcards: false, learnedWords: false, listeningPractice: false };
        if (!data.languages)
          missing.languages = [
            { code: "ja", name: "Japanese", flag: "🇯🇵", level: "Beginner", xp: 0, maxXp: 1000 },
            { code: "es", name: "Spanish", flag: "🇪🇸", level: "Beginner", xp: 0, maxXp: 1000 },
            { code: "fr", name: "French", flag: "🇫🇷", level: "Beginner", xp: 0, maxXp: 1000 },
          ];
        if (!data.recentActivity) missing.recentActivity = [];
        if (Object.keys(missing).length > 0) updateDoc(docRef, missing);
        setUserData(data);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const displaySkills = [
    { name: "Reading", value: userData?.skills?.reading ?? 0, color: "#4a7cf7" },
    { name: "Writing", value: userData?.skills?.writing ?? 0, color: "#a78bfa" },
    { name: "Listening", value: userData?.skills?.listening ?? 0, color: "#34d399" },
    { name: "Speaking", value: userData?.skills?.speaking ?? 0, color: "#f59e0b" },
  ];

  const displayDailyGoals = [
    { label: "Complete 1 Lesson", done: userData?.dailyGoals?.completedLesson ?? false },
    { label: "Review 20 Flashcards", done: userData?.dailyGoals?.reviewedFlashcards ?? false },
    { label: "Learn 10 New Words", done: userData?.dailyGoals?.learnedWords ?? false },
    { label: "10-min Listening Practice", done: userData?.dailyGoals?.listeningPractice ?? false },
  ];

  const displayLanguages: { code: string; name: string; flag: string; level: string; xp: number; maxXp: number }[] =
    userData?.languages ?? [
      { code: "ja", name: "Japanese", flag: "🇯🇵", level: "Beginner", xp: 0, maxXp: 1000 },
      { code: "es", name: "Spanish", flag: "🇪🇸", level: "Beginner", xp: 0, maxXp: 1000 },
      { code: "fr", name: "French", flag: "🇫🇷", level: "Beginner", xp: 0, maxXp: 1000 },
    ];

  const recentActivity: { action: string; lang: string; time: string; xp: string }[] =
    [...(userData?.recentActivity ?? [])].reverse().slice(0, 4);

  const selectedLang = LANG_OPTIONS.find((l) => l.code === selectedLangCode) ?? LANG_OPTIONS[0];
  const goalsDone = displayDailyGoals.filter((g) => g.done).length;
  const goalsTotal = displayDailyGoals.length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Good morning, {user?.displayName ?? "User"} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">
            {now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            {" · "}
            {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
          <Globe size={16} className="text-blue-500" />
          <select
            className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
            value={selectedLangCode}
            onChange={(e) => setSelectedLangCode(e.target.value)}
          >
            {LANG_OPTIONS.map((l) => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Day Streak", value: String(userData?.streak ?? 0), sub: "Keep it up!", icon: Flame, color: "#ff6b35", bg: "#fff3ee" },
          { label: "Total XP", value: (userData?.xp ?? 0).toLocaleString(), sub: "Earn more by learning", icon: Zap, color: "#4a7cf7", bg: "#eef2ff" },
          { label: "Words Learned", value: String(userData?.wordsLearned ?? 0), sub: "Keep learning!", icon: BookOpen, color: "#34d399", bg: "#ecfdf5" },
          { label: "Lessons Done", value: String(userData?.lessonsCompleted ?? 0), sub: "Great progress", icon: CheckCircle2, color: "#a78bfa", bg: "#f5f3ff" },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
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

      <div className="grid grid-cols-3 gap-6">
        {/* Skill Breakdown */}
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

        {/* Daily Goals */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
            <Target size={18} className="text-blue-500" /> Daily Goals
          </h2>
          <div className="space-y-3 mb-5">
            {displayDailyGoals.map(({ label, done }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
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

      {/* Languages Progress + Recent Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Languages */}
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

        {/* Recent Activity */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Recent Activity
            </h2>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No activity yet. Complete a lesson or flashcard session!</p>
            ) : (
              recentActivity.map(({ action, lang, time, xp }, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Star size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{action}</p>
                      <p className="text-xs text-gray-400">{lang} · {timeAgo(time)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">{xp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
