import { sanitizeLangCode, enforceRateLimit } from "@/lib/security";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

const LANG_NAMES: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  es: "Spanish",
  fr: "French",
};

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
type Level = (typeof LEVELS)[number];

function fallbackRecommendation(scores: number[]): { level: Level; recommendation: string } {
  if (scores.length === 0) {
    return {
      level: "beginner",
      recommendation: "Complete a few quizzes so we can tailor your difficulty level.",
    };
  }
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 80) {
    return { level: "advanced", recommendation: "You're doing great — try some advanced lessons next!" };
  }
  if (avg >= 60) {
    return { level: "intermediate", recommendation: "Solid progress — keep practicing at your current level." };
  }
  return { level: "beginner", recommendation: "Review the basics a bit more before moving forward." };
}

export async function POST(req: Request) {
  const rateLimit = enforceRateLimit(req, "/api/ai/adaptive-difficulty", 10, 60_000);
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

  const { userId, lang, recentScores } = await req.json();

  const safeUserId = String(userId ?? "").trim();
  if (!safeUserId || requesterUid !== safeUserId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const safeLang = sanitizeLangCode(lang, Object.keys(LANG_NAMES), "en");
  const langName = LANG_NAMES[safeLang] ?? "the target language";

  const safeScores: number[] = Array.isArray(recentScores)
    ? recentScores
        .map((s: unknown) => Number(s))
        .filter((s: number) => Number.isFinite(s) && s >= 0 && s <= 100)
        .slice(0, 3)
    : [];

  if (safeScores.length === 0) {
    return Response.json(fallbackRecommendation(safeScores));
  }

  const prompt = `A language learner studying ${langName} has these recent quiz scores (as percentages, most recent last): ${safeScores.join(", ")}.

Based on this performance, decide an appropriate difficulty level for their next lessons and give a short, encouraging, 1-sentence recommendation.

Respond ONLY with valid JSON in this exact format, no extra text, no markdown code fences:
{"level": "beginner" | "intermediate" | "advanced", "recommendation": "1 short sentence"}`;

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
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq adaptive-difficulty error:", JSON.stringify(data));
      return Response.json(fallbackRecommendation(safeScores));
    }

    const raw = data?.choices?.[0]?.message?.content?.trim() ?? "";

    try {
      const parsed = JSON.parse(raw);
      const level = (LEVELS as readonly string[]).includes(String(parsed?.level))
        ? (String(parsed.level) as Level)
        : fallbackRecommendation(safeScores).level;
      const recommendation =
        typeof parsed?.recommendation === "string" && parsed.recommendation.trim()
          ? parsed.recommendation.trim().slice(0, 200)
          : fallbackRecommendation(safeScores).recommendation;

      return Response.json({ level, recommendation });
    } catch (parseErr) {
      console.error("Failed to parse adaptive-difficulty JSON:", parseErr, raw);
      return Response.json(fallbackRecommendation(safeScores));
    }
  } catch (error) {
    console.error("Adaptive-difficulty AI error:", error);
    return Response.json(fallbackRecommendation(safeScores));
  }
}
