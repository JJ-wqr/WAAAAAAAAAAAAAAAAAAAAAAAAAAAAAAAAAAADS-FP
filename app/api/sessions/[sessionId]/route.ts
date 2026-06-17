import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Only the session's owner may revoke it
  if (session.userId !== requesterUid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.session.delete({ where: { id: sessionId } });

  return NextResponse.json({ message: "Session revoked successfully" });
}