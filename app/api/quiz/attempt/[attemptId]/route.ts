import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = await params;

  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: { answers: true },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  if (attempt.userId !== requesterUid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ attempt });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = await params;

  const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  if (attempt.userId !== requesterUid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.quizAttempt.delete({ where: { id: attemptId } });

  return NextResponse.json({ message: "Attempt deleted successfully" });
}