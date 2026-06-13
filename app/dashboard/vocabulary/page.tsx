"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Star, TrendingUp,
  Globe, Sun, Moon, Monitor,
  Layers, RotateCcw,
  Check, X, Eye, EyeOff,
  Sparkles, Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLang } from "@/components/languageprovider";
import { vocabularyData } from "@/lib/vocabularyData";
import { getLangInfo, LANGUAGES } from "@/lib/languages";
import { VocabularyFilters } from "./_components/VocabularyFilters";
import { VocabularyWordCard } from "./_components/VocabularyWordCard";
import SpeechButton from "@/components/SpeechButton";

const THEME_OPTIONS = [
  { value: "light",  icon: Sun,     label: "Light" },
  { value: "system", icon: Monitor, label: "Auto"  },
  { value: "dark",   icon: Moon,    label: "Dark"  },
] as const;

const SPEECH_LANG: Record<string, string> = {
  ja: "ja-JP", es: "es-ES", fr: "fr-FR", id: "id-ID",
};

// ── Flashcard Study Mode ─────────────────────────────────────────────────────
interface FlashcardProps {
  words: { word: string; romaji?: string; meaning: string; category: string; mastery: number }[];
  speechLang: string;
  onFinish: () => void;
}

function FlashcardStudy({ words, speechLang, onFinish }: FlashcardProps) {
  const [index, setIndex]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone]       = useState(false);
  const card = words[index];

  function answer(isCorrect: boolean) {
    if (isCorrect) setCorrect((c) => c + 1);
    if (index + 1 >= words.length) { setDone(true); }
    else { setFlipped(false); setTimeout(() => setIndex((i) => i + 1), 120); }
  }

  if (done) {
    const pct = Math.round((correct / words.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <Star size={36} className="text-green-500" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{pct}%</p>
          <p className="text-gray-500 mt-1">{correct} of {words.length} correct</p>
        </div>
        <button onClick={onFinish} className="px-6 py-3 rounded-2xl text-white font-semibold text-sm cursor-pointer" style={{ background: "#4a7cf7" }}>
          Back to vocabulary bank
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="w-full max-w-lg">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Card {index + 1} of {words.length}</span>
          <span>{correct} correct so far</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${(index / words.length) * 100}%`, background: "#4a7cf7" }} />
        </div>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className="w-full max-w-lg min-h-[220px] bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer select-none hover:shadow-xl transition-all p-8 text-center"
      >
        {!flipped ? (
          <>
            <p className="text-5xl font-bold text-gray-800">{card.word}</p>
            {card.romaji && <p className="text-sm text-gray-400 font-mono">{card.romaji}</p>}
            <span className="text-xs text-gray-300 mt-4 flex items-center gap-1"><Eye size={12} /> Tap to reveal meaning</span>
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold text-gray-700">{card.meaning}</p>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">{card.category}</span>
            <span className="text-xs text-gray-300 mt-2 flex items-center gap-1"><EyeOff size={12} /> Did you know it?</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <SpeechButton text={card.word} lang={speechLang} />
        <span className="text-xs text-gray-400">Hear pronunciation</span>
      </div>

      {flipped && (
        <div className="flex gap-4 w-full max-w-lg">
          <button onClick={() => answer(false)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition cursor-pointer">
            <X size={16} /> Didn&apos;t know
          </button>
          <button onClick={() => answer(true)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-green-200 text-green-600 font-semibold text-sm hover:bg-green-50 transition cursor-pointer">
            <Check size={16} /> Got it!
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function VocabularyPage() {
  const { lang, setLang } = useLang();
  const words = vocabularyData[lang];
  const langInfo = getLangInfo(lang);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState<"all" | "known" | "learning">("all");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [view, setView] = useState<"bank" | "flashcards">("bank");
  const [aiExamples, setAiExamples] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading]   = useState<Record<string, boolean>>({});
  const speechLang = SPEECH_LANG[lang] ?? "en-US";

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
    id: "id-ID",
  };

  async function handleAiExample(w: { word: string; meaning: string }) {
    if (aiLoading[w.word] || aiExamples[w.word]) return;
    setAiLoading((prev) => ({ ...prev, [w.word]: true }));
    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Give ONE short example sentence using "${w.word}" (${w.meaning}) in ${langInfo.name}. Reply with just the sentence.`,
          userAnswer: w.word,
          correctAnswer: w.meaning,
          lang,
        }),
      });
      const data = await res.json();
      setAiExamples((prev) => ({ ...prev, [w.word]: data.feedback ?? "Could not generate example." }));
    } catch {
      setAiExamples((prev) => ({ ...prev, [w.word]: "AI unavailable. Try again later." }));
    } finally {
      setAiLoading((prev) => ({ ...prev, [w.word]: false }));
    }
  }

  const flashcardSet = [...filtered].sort((a, b) => a.mastery - b.mastery);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vocabulary Bank</h1>
          <p className="text-gray-500 text-sm mt-1">
            {langInfo.flag} {langInfo.name} — Track and review all the words you&apos;ve learned.
          </p>
        </div>
        <button
          onClick={() => setView(view === "bank" ? "flashcards" : "bank")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
          style={{ background: view === "flashcards" ? "#7c3aed" : "#4a7cf7" }}
        >
          {view === "bank" ? <><Layers size={15} /> Study flashcards</> : <><RotateCcw size={15} /> Back to bank</>}
        </button>
      </div>

      {/* Language + Theme bar */}
      <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
        <Globe size={16} className="text-blue-500 shrink-0" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Parameters<typeof setLang>[0])}
          className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-1 p-1 rounded-xl bg-gray-100">
          {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={label}
              className={`flex items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer ${
                mounted && theme === value ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
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

      {/* Flashcard mode */}
      {view === "flashcards" && (
        <FlashcardStudy
          words={flashcardSet}
          speechLang={speechLang}
          onFinish={() => setView("bank")}
        />
      )}

      {/* Bank mode */}
      {view === "bank" && (
        <>
          <VocabularyFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            filter={filter}
            setFilter={setFilter}
          />

          <div className="grid grid-cols-3 gap-4">
            {filtered.map((w) => (
              <div key={w.word} className="flex flex-col gap-2">
                <VocabularyWordCard word={w} speechLang={speechLangMap[lang] || "en-US"} />
                <div className="px-1">
                  {aiExamples[w.word] ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs text-blue-700 leading-relaxed">
                      {aiExamples[w.word]}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAiExample(w)}
                      disabled={aiLoading[w.word]}
                      className="flex items-center gap-1.5 text-xs text-purple-500 hover:text-purple-700 transition cursor-pointer disabled:opacity-50"
                    >
                      {aiLoading[w.word]
                        ? <><Loader2 size={11} className="animate-spin" /> Generating…</>
                        : <><Sparkles size={11} /> AI example sentence</>
                      }
                    </button>
                  )}
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
        </>
      )}
    </div>
  );
}