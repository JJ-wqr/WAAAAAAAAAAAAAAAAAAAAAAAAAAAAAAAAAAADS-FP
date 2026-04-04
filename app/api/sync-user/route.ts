import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { uid, email, name, image } = await req.json();

  if (!uid || !email) {
    return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: name ?? undefined, image: image ?? undefined },
    create: {
      id: uid,
      email,
      name: name ?? null,
      image: image ?? null,
      emailVerified: false,
    },
  });

  return NextResponse.json({ user });
}
