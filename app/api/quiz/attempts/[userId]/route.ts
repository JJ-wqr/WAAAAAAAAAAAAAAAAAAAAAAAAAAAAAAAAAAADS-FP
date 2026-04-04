import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/quiz/attempts/:userId
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId, ...(lang ? { lang } : {}) },
    include: { answers: true },
    orderBy: { completedAt: "desc" },
  });

  return NextResponse.json({ attempts, total: attempts.length });
}
