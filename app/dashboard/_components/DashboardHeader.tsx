"use client";

import { Globe } from "lucide-react";
import { LANGUAGES, type LangCode } from "@/lib/languages";

export function DashboardHeader({ user, now, selectedLangCode, setSelectedLangCode }: {
  user: any;
  now: Date;
  selectedLangCode: LangCode;
  setSelectedLangCode: (lang: LangCode) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Good morning, {user?.displayName ?? "User"} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">
          {now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
        <Globe size={16} className="text-blue-500" />
        <select
          className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
          value={selectedLangCode}
          onChange={(e) => setSelectedLangCode(e.target.value as LangCode)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
