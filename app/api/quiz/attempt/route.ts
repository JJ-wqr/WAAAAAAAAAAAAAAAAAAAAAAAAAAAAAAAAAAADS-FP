import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeLangCode, enforceRateLimit } from "@/lib/security";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

// POST /api/quiz/attempt
export async function POST(req: NextRequest) {
  const rateLimit = enforceRateLimit(req, "/api/quiz/attempt", 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const userId = String(body.userId ?? "").trim();
  const lessonId = Number(body.lessonId);
  const lang = body.lang;
  const score = Number(body.score);
  const xpEarned = Number(body.xpEarned);
  const answers = body.answers;

  if (!userId || Number.isNaN(lessonId) || !lang || Number.isNaN(score) || Number.isNaN(xpEarned)) {
    return NextResponse.json(
      { error: "Missing required fields: userId, lessonId, lang, score, xpEarned" },
      { status: 400 }
    );
  }

  if (requesterUid !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Ensure user row exists before inserting attempt (foreign key constraint)
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@unknown.local`, emailVerified: false },
  });

  const safeLang = sanitizeLangCode(lang, ["ja", "en", "es", "fr"], "en");
  const sanitizedAnswers = Array.isArray(answers)
    ? answers
        .filter((a: unknown): a is Record<string, unknown> => Boolean(a) && typeof a === "object")
        .map((a) => ({
          questionIndex: Number(a.questionIndex ?? 0),
          selectedOption: Number(a.selectedOption ?? 0),
          isCorrect: Boolean(a.isCorrect),
        }))
    : [];

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      lessonId,
      lang: safeLang,
      score,
      xpEarned,
      answers: sanitizedAnswers.length
        ? {
            create: sanitizedAnswers,
          }
        : undefined,
    },
    include: { answers: true },
  });

  return NextResponse.json({ attempt }, { status: 201 });
}
