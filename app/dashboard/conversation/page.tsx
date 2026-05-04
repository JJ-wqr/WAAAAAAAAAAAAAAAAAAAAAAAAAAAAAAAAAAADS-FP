"use client";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLang } from "@/components/languageprovider";
import { ChatHeader } from "./_components/ChatHeader";
import { MessageBubble } from "./_components/MessageBubble";
import { ChatInput } from "./_components/ChatInput";

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
      <ChatHeader lang={lang} onReset={reset} />

      {/* Messages */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-y-auto flex flex-col gap-3 mb-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
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
      <ChatInput input={input} setInput={setInput} send={send} loading={loading} />
    </div>
  );
}