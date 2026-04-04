import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/:uid
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

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
  const body = await req.json();
  const { name, image } = body;

  const existing = await prisma.user.findUnique({ where: { id: uid } });
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: uid },
    data: {
      name: name ?? existing.name,
      image: image ?? existing.image,
    },
  });

  return NextResponse.json({ user: updated });
}

// DELETE /api/users/:uid
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

  const existing = await prisma.user.findUnique({ where: { id: uid } });
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: uid } });

  return NextResponse.json({ message: "User deleted successfully" });
}
