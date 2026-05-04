"use client";

import { RefreshCw, Bot } from "lucide-react";
import { getLangInfo } from "@/lib/languages";

export function ChatHeader({ lang, onReset }: { lang: string; onReset: () => void }) {
  const langInfo = getLangInfo(lang);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "#4a7cf7" }}>
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">AI Conversation</h1>
          <p className="text-sm text-gray-500">Practicing {langInfo.flag} {langInfo.name}</p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
      >
        <RefreshCw size={15} /> New chat
      </button>
    </div>
  );
}
