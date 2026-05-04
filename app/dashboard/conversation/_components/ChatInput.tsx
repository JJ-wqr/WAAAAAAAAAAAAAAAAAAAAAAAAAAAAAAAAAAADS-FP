"use client";

import { Send } from "lucide-react";
import { useLang } from "@/components/languageprovider";
import { getLangInfo } from "@/lib/languages";

export function ChatInput({ input, setInput, send, loading }: {
  input: string;
  setInput: (value: string) => void;
  send: () => void;
  loading: boolean;
}) {
  const { lang } = useLang();
  const langInfo = getLangInfo(lang);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder={`Type in ${langInfo.name}...`}
        disabled={loading}
        className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
      />
      <button
        onClick={send}
        disabled={!input.trim() || loading}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 shrink-0"
        style={{ background: "#4a7cf7" }}
      >
        <Send size={16} />
      </button>
    </div>
  );
}
