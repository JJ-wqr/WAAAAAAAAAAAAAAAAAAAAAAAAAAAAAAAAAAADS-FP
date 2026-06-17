import { sanitizeLangCode, enforceRateLimit } from "@/lib/security";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

const LANG_NAMES: Record<string, string> = {
  ja: "Japanese",
  en: "English",
  es: "Spanish",
  fr: "French",
};

type DifficultyLevel = "beginner" | "intermediate" | "advanced";

function fallbackRecommendation(scores: number[]): {
  level: DifficultyLevel;
  recommendation: string;
} {
  if (scores.length === 0) {
    return {
      level: "beginner",
      recommendation:
        "Complete a few quizzes first so we can personalise your difficulty level.",
    };
  }
  const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
  if (avg >= 80) {
    return {
      level: "advanced",
      recommendation:
        "Great work! Your scores suggest you're ready for advanced material.",
    };
  }
  if (avg >= 50) {
    return {
      level: "intermediate",
      recommendation:
        "You're making solid progress — intermediate lessons will keep you challenged.",
    };
  }
  return {
    level: "beginner",
    recommendation:
      "Keep practising! Beginner lessons will build a strong foundation.",
  };
}

export async function POST(req: Request) {
  const rateLimit = enforceRateLimit(req, "/api/ai/adaptive-difficulty", 10, 60_000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimit.retryAfter ?? 60),
        },
      }
    );
  }

  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, lang, recentScores } = body;

  // Authorization: users can only request their own recommendation
  if (requesterUid !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const safeLang = sanitizeLangCode(lang, Object.keys(LANG_NAMES), "en");
  const langName = LANG_NAMES[safeLang] ?? "English";

  // Validate and sanitize scores
  const safeScores: number[] = Array.isArray(recentScores)
    ? recentScores
        .map((s: unknown) => Number(s))
        .filter((n: number) => !isNaN(n) && n >= 0 && n <= 100)
        .slice(0, 5)
    : [];

  // If no valid scores, return fallback without calling AI
  if (safeScores.length === 0) {
    return Response.json(fallbackRecommendation([]));
  }

  const avg = Math.round(safeScores.reduce((s, v) => s + v, 0) / safeScores.length);
  const scoresSummary = safeScores.join(", ");

  const prompt = `You are an adaptive language learning coach for a ${langName} learner.

The learner's recent quiz scores (out of 100) are: ${scoresSummary}
Average score: ${avg}/100

Based on these scores, recommend ONE of the following difficulty levels:
- "beginner" (average below 50)
- "intermediate" (average 50–79)
- "advanced" (average 80+)

Respond ONLY with valid JSON in this exact format, no extra text, no markdown:
{"level":"beginner|intermediate|advanced","recommendation":"One encouraging sentence (max 20 words) explaining the recommendation."}`;

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
        max_tokens: 80,
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Groq adaptive-difficulty error:", response.statusText);
      return Response.json(fallbackRecommendation(safeScores));
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content?.trim() ?? "";

    let parsed: { level?: string; recommendation?: string } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Adaptive difficulty: failed to parse AI JSON:", raw);
      return Response.json(fallbackRecommendation(safeScores));
    }

    const validLevels: DifficultyLevel[] = ["beginner", "intermediate", "advanced"];
    const level: DifficultyLevel = validLevels.includes(parsed.level as DifficultyLevel)
      ? (parsed.level as DifficultyLevel)
      : fallbackRecommendation(safeScores).level;

    const recommendation =
      typeof parsed.recommendation === "string" && parsed.recommendation.length > 0
        ? parsed.recommendation.slice(0, 200)
        : fallbackRecommendation(safeScores).recommendation;

    return Response.json({ level, recommendation });
  } catch (error) {
    console.error("Adaptive difficulty AI error:", error);
    return Response.json(fallbackRecommendation(safeScores));
  }
}