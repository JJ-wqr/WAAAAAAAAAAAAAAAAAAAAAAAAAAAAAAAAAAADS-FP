"use client";

import { Bot, AlertCircle } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  correction?: string | null;
};

export function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
        {msg.role === "assistant" && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "#4a7cf7" }}>
            <Bot size={14} />
          </div>
        )}
        <div
          className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            msg.role === "user"
              ? "text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
          style={msg.role === "user" ? { background: "#4a7cf7" } : {}}
        >
          {msg.content}
        </div>
      </div>

      {msg.role === "assistant" && msg.correction && (
        <div className="flex items-start gap-2 ml-9 max-w-[90%] px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
          <AlertCircle size={14} className="shrink-0 mt-0.5 text-yellow-500" />
          <span><strong>Grammar tip:</strong> {msg.correction}</span>
        </div>
      )}
    </div>
  );
}
