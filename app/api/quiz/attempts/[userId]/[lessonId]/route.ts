import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/quiz/attempts/:userId/:lessonId
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; lessonId: string }> }
) {
  const { userId, lessonId } = await params;
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId,
      lessonId: parseInt(lessonId),
      ...(lang ? { lang } : {}),
    },
    include: { answers: true },
    orderBy: { completedAt: "desc" },
  });

  return NextResponse.json({ attempts, total: attempts.length });
}
