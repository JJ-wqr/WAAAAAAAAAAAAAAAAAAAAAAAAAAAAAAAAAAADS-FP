"use client";
import { useState } from "react";
import { BookOpen, Star, TrendingUp } from "lucide-react";
import { useLang } from "@/components/languageprovider";
import { VocabularyFilters } from "./_components/VocabularyFilters";
import { VocabularyWordCard } from "./_components/VocabularyWordCard";
import { vocabularyData } from "@/lib/vocabularyData";
import { getLangInfo } from "@/lib/languages";

const categories = ["All", "Nouns", "Verbs", "Adjectives"];

function masteryColor(m: number) {
  if (m >= 80) return "#34d399";
  if (m >= 50) return "#f59e0b";
  return "#f87171";
}

export default function VocabularyPage() {
  const { lang } = useLang();
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
      <VocabularyFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Word Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((w) => (
          <VocabularyWordCard key={w.word} word={w} speechLang={speechLangMap[lang] || "en-US"} />
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
