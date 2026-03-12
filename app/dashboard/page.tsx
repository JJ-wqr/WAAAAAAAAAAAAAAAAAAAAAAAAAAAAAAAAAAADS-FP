"use client";
import { useState } from "react";
import {
  Flame,
  Zap,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Globe,
  ChevronRight,
  Star,
  Clock,
  Target,
} from "lucide-react";

const languages = [
  { code: "ja", name: "Japanese", flag: "🇯🇵", level: "Intermediate", xp: 2340, maxXp: 3000 },
  { code: "es", name: "Spanish", flag: "🇪🇸", level: "Advanced", xp: 4800, maxXp: 5000 },
  { code: "fr", name: "French", flag: "🇫🇷", level: "Beginner", xp: 450, maxXp: 1000 },
];

const skills = [
  { name: "Reading", value: 72, color: "#4a7cf7" },
  { name: "Writing", value: 58, color: "#a78bfa" },
  { name: "Listening", value: 85, color: "#34d399" },
  { name: "Speaking", value: 45, color: "#f59e0b" },
];

const recentActivity = [
  { action: "Completed Lesson 12: Past Tense", lang: "🇯🇵 Japanese", time: "2h ago", xp: "+20 XP" },
  { action: "Flashcard Session – 30 cards", lang: "🇪🇸 Spanish", time: "Yesterday", xp: "+15 XP" },
  { action: "Vocabulary Quiz – 95%", lang: "🇫🇷 French", time: "Yesterday", xp: "+25 XP" },
  { action: "Started: Greetings & Intro", lang: "🇯🇵 Japanese", time: "2 days ago", xp: "+10 XP" },
];

const dailyGoals = [
  { label: "Complete 1 Lesson", done: true },
  { label: "Review 20 Flashcards", done: true },
  { label: "Learn 10 New Words", done: false },
  { label: "10-min Listening Practice", done: false },
];

export default function DashboardPage() {
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Good morning, Alex! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Keep up the streak – you&apos;re on a roll!</p>
        </div>
        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
          <Globe size={16} className="text-blue-500" />
          <select
            className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
            value={selectedLang.code}
            onChange={(e) => setSelectedLang(languages.find((l) => l.code === e.target.value) || languages[0])}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Day Streak", value: "24", sub: "Personal best: 31", icon: Flame, color: "#ff6b35", bg: "#fff3ee" },
          { label: "Total XP", value: "7,590", sub: "+120 this week", icon: Zap, color: "#4a7cf7", bg: "#eef2ff" },
          { label: "Words Learned", value: "1,248", sub: "+18 today", icon: BookOpen, color: "#34d399", bg: "#ecfdf5" },
          { label: "Lessons Done", value: "86", sub: "3 in progress", icon: CheckCircle2, color: "#a78bfa", bg: "#f5f3ff" },
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
            {skills.map(({ name, value, color }) => (
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
            {dailyGoals.map(({ label, done }) => (
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
          {/* Progress ring display */}
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="38" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="48" cy="48" r="38" fill="none" stroke="#4a7cf7" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - 0.5)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">2/4</span>
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
            {languages.map((lang) => (
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
            <button className="text-xs text-blue-500 hover:underline flex items-center gap-1">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map(({ action, lang, time, xp }, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Star size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{action}</p>
                    <p className="text-xs text-gray-400">{lang} · {time}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">{xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
