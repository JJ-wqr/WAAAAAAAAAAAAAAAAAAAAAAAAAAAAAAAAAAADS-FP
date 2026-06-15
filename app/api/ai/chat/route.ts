import { sanitizeChatMessages, sanitizeLangCode, enforceRateLimit } from "@/lib/security";

const LANG_NAMES: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  es: "Spanish",
  fr: "French",
};

export async function POST(req: Request) {
  const rateLimit = enforceRateLimit(req, "/api/ai/chat", 15, 60_000);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(rateLimit.retryAfter ?? 60) },
    });
  }

  const { messages, lang } = await req.json();
  const safeMessages = sanitizeChatMessages(messages);
  if (safeMessages.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid chat data." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const safeLang = sanitizeLangCode(lang, Object.keys(LANG_NAMES), "en");
  const langName = LANG_NAMES[safeLang] ?? "the target language";

  const systemPrompt = `You are a friendly and encouraging language tutor helping the user practice ${langName} through conversation.
Rules:
- Respond primarily in ${langName}
- Add brief English translations in parentheses for difficult or uncommon words
- Gently correct grammar mistakes if you notice them, then continue the conversation
- Keep responses short and conversational (2-4 sentences max)
- Ask follow-up questions to keep the conversation going
- Adjust your vocabulary to match the user's apparent level`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
        max_tokens: 200,
        temperature: 0.7,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq chat error:", JSON.stringify(data));
      return Response.json(
        { error: data?.error?.message ?? "AI error" },
        { status: 500 }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ?? "Sorry, I didn't understand.";

    // Second call: check the user's last message for grammar errors
    const correction = await checkGrammar(safeMessages, langName);

    return Response.json({ reply, correction });
  } catch (error) {
    console.error("Chat AI error:", error);
    return Response.json(
      { error: "AI service error. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Checks the user's most recent message for grammar errors in the target
 * language. Returns a short correction string, or `null` if no errors are
 * found or the AI call fails (failure here should never break the main chat
 * reply).
 */
async function checkGrammar(
  messages: { role: "user" | "assistant"; content: string }[],
  langName: string
): Promise<string | null> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMessage || !lastUserMessage.content.trim()) return null;

  const prompt = `You are a ${langName} grammar checker. Look at the following text written by a language learner and check it for grammar, spelling, or word-choice errors in ${langName}.

Text: "${lastUserMessage.content}"

If there are no significant errors, respond with exactly: NONE
If there are errors, respond with ONLY a short correction tip (max 1-2 sentences), written in English, briefly explaining the mistake and the corrected form. Do not include any other text.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.3,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Groq grammar-check error:", response.statusText);
      return null;
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content?.trim() ?? "NONE";

    if (!raw || raw.toUpperCase().startsWith("NONE")) return null;

    return raw.slice(0, 300);
  } catch (error) {
    console.error("Grammar-check AI error:", error);
    return null;
  }
}
