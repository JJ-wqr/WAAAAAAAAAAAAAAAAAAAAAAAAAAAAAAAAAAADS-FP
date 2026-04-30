"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2, RefreshCw } from "lucide-react";
import { useLang } from "@/components/languageprovider";
import { getLangInfo } from "@/lib/languages";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETINGS: Record<string, string> = {
  ja: "こんにちは！(Hello!) I'm your Japanese tutor. Let's practice together! 何について話したいですか？(What would you like to talk about?)",
  en: "Hello! I'm your English tutor. Let's practice together! What would you like to talk about today?",
  es: "¡Hola! (Hello!) Soy tu tutor de español. ¡Practiquemos juntos! ¿De qué quieres hablar hoy?",
  fr: "Bonjour ! (Hello!) Je suis ton tuteur de français. Pratiquons ensemble ! De quoi veux-tu parler aujourd'hui ?",
};

export default function ConversationPage() {
  const { lang } = useLang();
  const langInfo = getLangInfo(lang);

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETINGS[lang] ?? GREETINGS.en },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setMessages([{ role: "assistant", content: GREETINGS[lang] ?? GREETINGS.en }]);
    setInput("");
  }, [lang]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, lang }),
      });
      const data = await res.json();
      setMessages([
        ...updated,
        { role: "assistant", content: data.reply ?? data.error ?? "Sorry, try again." },
      ]);
    } catch {
      setMessages([
        ...updated,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([{ role: "assistant", content: GREETINGS[lang] ?? GREETINGS.en }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: "#4a7cf7" }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">AI Conversation</h1>
            <p className="text-sm text-gray-500">
              Practicing {langInfo.flag} {langInfo.name}
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
        >
          <RefreshCw size={15} />
          New chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-y-auto flex flex-col gap-3 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ background: "#4a7cf7" }}
              >
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
        ))}

        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
              style={{ background: "#4a7cf7" }}
            >
              <Bot size={14} />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
    </div>
  );
}