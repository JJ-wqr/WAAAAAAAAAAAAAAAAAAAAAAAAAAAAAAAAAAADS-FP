"use client";
import { useState } from "react";
import { Search, Volume2, Star, BookOpen, TrendingUp, Globe, Sun, Moon, Monitor } from "lucide-react";
import { useLang } from "@/components/languageprovider";
import { useTheme } from "next-themes";
import SpeechButton from "@/components/SpeechButton";
import { vocabularyData } from "@/lib/vocabularyData";
import { getLangInfo, LANGUAGES } from "@/lib/languages";

const categories = ["All", "Nouns", "Verbs", "Adjectives"];

const THEME_OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "Auto" },
  { value: "dark", icon: Moon, label: "Dark" },
];

function masteryColor(m: number) {
  if (m >= 80) return "#34d399";
  if (m >= 50) return "#f59e0b";
  return "#f87171";
}

export default function VocabularyPage() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const words = vocabularyData[lang];
  const langInfo = getLangInfo(lang);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState<"all" | "known" | "learning">("all");

  const filtered = words.filter((w) => {
    const matchCat = category === "All" || w.category === category;
    const matchSearch =
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.romaji.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "known" && w.known) ||
      (filter === "learning" && !w.known);
    return matchCat && matchSearch && matchFilter;
  });

  const avgMastery = Math.round(words.reduce((s, w) => s + w.mastery, 0) / words.length);

  const speechLangMap: Record<string, string> = {
    ja: "ja-JP",
    es: "es-ES",
    fr: "fr-FR",
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vocabulary Bank</h1>
        <p className="text-gray-500 text-sm mt-1">
          {langInfo.flag} {langInfo.name} — Track and review all the words you&apos;ve learned.
        </p>
      </div>

      {/* Language + Theme Selector Bar */}
      <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
        <Globe size={16} className="text-blue-500 shrink-0" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.name}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-1 p-1 rounded-xl bg-gray-100">
          {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={label}
              className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                theme === value
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Words", value: words.length.toString(), icon: BookOpen, color: "#4a7cf7", bg: "#eef2ff" },
          { label: "Mastered", value: words.filter((w) => w.mastery >= 80).length.toString(), icon: Star, color: "#34d399", bg: "#ecfdf5" },
          { label: "Avg. Mastery", value: `${avgMastery}%`, icon: TrendingUp, color: "#f59e0b", bg: "#fffbeb" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                category === c ? "text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
              style={category === c ? { background: "#4a7cf7" } : {}}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {(["all", "known", "learning"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition ${
                filter === f ? "text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
              style={filter === f ? { background: "#a78bfa" } : {}}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Word Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((w) => (
          <div key={w.word} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-gray-800">{w.word}</p>
                <p className="text-xs text-gray-400 mt-0.5">{w.romaji}</p>
              </div>

              {/* Speech button */}
              <SpeechButton text={w.word} lang={speechLangMap[lang] || "en-US"} />

            </div>
            <p className="text-sm text-gray-600 mb-3">{w.meaning}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">{w.category}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${w.mastery}%`, background: masteryColor(w.mastery) }}
                  />
                </div>
                <span className="text-xs font-semibold" style={{ color: masteryColor(w.mastery) }}>
                  {w.mastery}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
          <p>No words found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
