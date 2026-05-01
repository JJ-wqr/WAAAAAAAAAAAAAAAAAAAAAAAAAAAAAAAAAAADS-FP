"use client";
import { Search } from "lucide-react";

export function VocabularyFilters({ search, setSearch, category, setCategory, filter, setFilter }: {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  filter: "all" | "known" | "learning";
  setFilter: (value: "all" | "known" | "learning") => void;
}) {
  const categories = ["All", "Nouns", "Verbs", "Adjectives"];

  return (
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
        {( ["all", "known", "learning"] as const ).map((f) => (
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
  );
}
