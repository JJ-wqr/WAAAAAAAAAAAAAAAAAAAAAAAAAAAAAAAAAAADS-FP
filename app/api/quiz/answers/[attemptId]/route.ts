import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/quiz/answers/:attemptId
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params;

  const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  const answers = await prisma.quizAnswer.findMany({
    where: { attemptId },
    orderBy: { questionIndex: "asc" },
  });

  const total = answers.length;
  const correct = answers.filter((a: { isCorrect: boolean }) => a.isCorrect).length;

  return NextResponse.json({ answers, total, correct, incorrect: total - correct });
}
