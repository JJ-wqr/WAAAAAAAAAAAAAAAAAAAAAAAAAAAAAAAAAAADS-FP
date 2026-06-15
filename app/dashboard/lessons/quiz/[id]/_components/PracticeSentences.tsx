"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { authedFetch } from "@/lib/authedFetch";
import type { LangCode } from "@/lib/languages";

type Sentence = { text: string; translation: string };
type Level = "beginner" | "intermediate" | "advanced";

export function PracticeSentences({
  topic,
  lang,
  level = "beginner",
}: {
  topic: string;
  lang: LangCode;
  level?: Level;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentences, setSentences] = useState<Sentence[] | null>(null);
  const fetchSentences = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await authedFetch("/api/ai/generate-sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, lang, level }),
      });
      const data = await res.json();
      if (!res.ok || !data.sentences) {
        setError(data.error ?? "Couldn't generate practice sentences. Try again.");
        setSentences(null);
      } else {
        setSentences(data.sentences);
      }
    } catch {
      setError("Connection error. Please try again.");
      setSentences(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && (!sentences || sentences.length === 0)) {
      await fetchSentences();
    }
  };

  const handleRetry = async () => {
    setSentences(null);
    setError(null);
    await fetchSentences();
  };

  // Reset and optionally refetch when the topic or language changes so no stale data remains
  useEffect(() => {
    setSentences(null);
    setError(null);
    // if panel is open, fetch immediately for new topic
    if (open) {
      // don't await here
      fetchSentences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, lang, level]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Sparkles size={16} className="text-purple-500" />
          Practice Sentences
        </span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 py-2">
              <Loader2 size={14} className="animate-spin" />
              Generating example sentences...
            </div>
          )}

          {error && !loading && (
            <div className="space-y-2">
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={handleRetry}
                className="text-xs font-medium text-blue-500 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {sentences && !loading && (
            <ul className="space-y-3">
              {sentences.map((s, i) => (
                <li key={i} className="p-3 rounded-xl bg-purple-50">
                  <p className="text-slate-900 font-semibold">{s.text}</p>
                  <p className="text-slate-600 text-sm mt-0.5">{s.translation}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
