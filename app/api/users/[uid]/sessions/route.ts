import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/:uid/sessions
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const sessions = await prisma.session.findMany({
    where: { userId: uid },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ sessions, total: sessions.length });
}
