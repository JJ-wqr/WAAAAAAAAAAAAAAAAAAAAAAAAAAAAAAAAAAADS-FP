import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { uid } = await params;

  if (requesterUid !== uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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