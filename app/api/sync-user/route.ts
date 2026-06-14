import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeText, isValidEmail, enforceRateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  const rateLimit = enforceRateLimit(req, "/api/sync-user", 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  const { uid, email, name, image } = await req.json();
  const emailValue = String(email ?? "").trim();

  if (!uid || !emailValue || !isValidEmail(emailValue)) {
    return NextResponse.json({ error: "Missing or invalid uid/email" }, { status: 400 });
  }

  const safeName = sanitizeText(name, 100);
  const safeImage = sanitizeText(image, 500);

  const user = await prisma.user.upsert({
    where: { email: emailValue },
    update: { name: safeName ?? undefined, image: safeImage ?? undefined },
    create: {
      id: uid,
      email: emailValue,
      name: safeName ?? null,
      image: safeImage ?? null,
      emailVerified: false,
    },
  });

  return NextResponse.json({ user });
}
