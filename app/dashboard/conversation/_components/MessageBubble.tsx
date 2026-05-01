"use client";
import { Bot } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
      {msg.role === "assistant" && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "#4a7cf7" }}>
          <Bot size={14} />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          msg.role === "user"
            ? "text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
        style={msg.role === "user" ? { background: "#4a7cf7" } : {}}
      >
        {msg.content}
      </div>
    </div>
  );
}
