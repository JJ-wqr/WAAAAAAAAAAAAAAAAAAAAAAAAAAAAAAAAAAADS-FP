import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/quiz/attempt
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, lessonId, lang, score, xpEarned, answers } = body;

  if (!userId || lessonId === undefined || !lang || score === undefined || xpEarned === undefined) {
    return NextResponse.json(
      { error: "Missing required fields: userId, lessonId, lang, score, xpEarned" },
      { status: 400 }
    );
  }

  // Ensure user row exists before inserting attempt (foreign key constraint)
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@unknown.local`, emailVerified: false },
  });

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      lessonId,
      lang,
      score,
      xpEarned,
      answers: answers?.length
        ? {
            create: answers.map((a: { questionIndex: number; selectedOption: number; isCorrect: boolean }) => ({
              questionIndex: a.questionIndex,
              selectedOption: a.selectedOption,
              isCorrect: a.isCorrect,
            })),
          }
        : undefined,
    },
    include: { answers: true },
  });

  return NextResponse.json({ attempt }, { status: 201 });
}
