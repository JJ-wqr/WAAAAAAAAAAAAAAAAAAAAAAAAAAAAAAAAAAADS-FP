import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeText, enforceRateLimit } from "@/lib/security";
import { getAuthenticatedUid } from "@/lib/firebaseAdmin";

// GET /api/users/:uid
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (requesterUid !== uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// PUT /api/users/:uid
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;
  const rateLimit = enforceRateLimit(req, "/api/users/:uid", 20, 60_000);
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
  if (requesterUid !== uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, image } = body;

  const existing = await prisma.user.findUnique({ where: { id: uid } });
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const safeName = sanitizeText(name, 100);
  const safeImage = sanitizeText(image, 500);

  const updated = await prisma.user.update({
    where: { id: uid },
    data: {
      name: safeName || existing.name,
      image: safeImage || existing.image,
    },
  });

  return NextResponse.json({ user: updated });
}

// DELETE /api/users/:uid
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const rateLimit = enforceRateLimit(req, "/api/users/:uid", 10, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  const { uid } = await params;

  const requesterUid = await getAuthenticatedUid(req.headers.get("authorization"));
  if (!requesterUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (requesterUid !== uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { id: uid } });
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: uid } });

  return NextResponse.json({ message: "User deleted successfully" });
}
