const LANG_NAMES: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  es: "Spanish",
  fr: "French",
};

export async function POST(req: Request) {
  const { messages, lang } = await req.json();

  const langName = LANG_NAMES[lang] ?? "the target language";

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
        messages: [{ role: "system", content: systemPrompt }, ...messages],
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

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat AI error:", error);
    return Response.json(
      { error: "AI service error. Please try again." },
      { status: 500 }
    );
  }
}
