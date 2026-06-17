import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; lessonId: string }> }
) {
  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, lessonId } = await params;

  if (requesterUid !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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