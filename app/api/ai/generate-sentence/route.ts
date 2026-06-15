import { sanitizeText, sanitizeLangCode, enforceRateLimit } from "@/lib/security";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

const LANG_NAMES: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  es: "Spanish",
  fr: "French",
};

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

export async function POST(req: Request) {
  const rateLimit = enforceRateLimit(req, "/api/ai/generate-sentence", 10, 60_000);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(rateLimit.retryAfter ?? 60) },
    });
  }

  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, lang, level } = await req.json();

  const safeTopic = sanitizeText(topic, 100);
  const safeLang = sanitizeLangCode(lang, Object.keys(LANG_NAMES), "en");
  const safeLevel = (LEVELS as readonly string[]).includes(String(level))
    ? (String(level) as (typeof LEVELS)[number])
    : "beginner";

  if (!safeTopic) {
    return Response.json({ error: "Topic is required." }, { status: 400 });
  }

  const langName = LANG_NAMES[safeLang] ?? "the target language";

  const systemPrompt = `You are a language learning content generator. Generate exactly 3 example sentences in ${langName} related to the topic "${safeTopic}", suitable for a ${safeLevel} learner.

Rules:
- Each sentence must be natural and commonly used
- Provide the English translation for each sentence
- Match the vocabulary and grammar complexity to a ${safeLevel} level
- Respond ONLY with valid JSON in this exact format, with no extra text, no markdown code fences:
{"sentences": [{"text": "sentence in ${langName}", "translation": "English translation"}, {"text": "...", "translation": "..."}, {"text": "...", "translation": "..."}]}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }],
        max_tokens: 400,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq generate-sentence error:", JSON.stringify(data));
      return Response.json(
        { error: data?.error?.message ?? "AI error" },
        { status: 500 }
      );
    }

    const raw = data?.choices?.[0]?.message?.content?.trim() ?? "";

    let sentences: { text: string; translation: string }[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.sentences)) {
        sentences = parsed.sentences
          .filter((s: unknown): s is Record<string, unknown> => Boolean(s) && typeof s === "object")
          .map((s: Record<string, unknown>) => ({   
            text: sanitizeText(s.text, 300),
            translation: sanitizeText(s.translation, 300),
          }))
          .filter((s: { text: any; translation: any; }) => s.text && s.translation)
          .slice(0, 3);
      }
    } catch (parseErr) {
      console.error("Failed to parse AI sentence JSON:", parseErr, raw);
    }

    if (sentences.length === 0) {
      return Response.json(
        { error: "AI returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ sentences, topic: safeTopic, lang: safeLang, level: safeLevel });
  } catch (error) {
    console.error("Generate-sentence AI error:", error);
    return Response.json(
      { error: "AI service error. Please try again." },
      { status: 500 }
    );
  }
}
