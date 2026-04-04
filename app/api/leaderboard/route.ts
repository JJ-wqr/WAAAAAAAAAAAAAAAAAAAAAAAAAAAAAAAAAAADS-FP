import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/leaderboard
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

  const users = await prisma.user.findMany({
    select: { id: true, name: true, image: true, email: true },
    take: limit,
  });

  return NextResponse.json({ leaderboard: users, total: users.length });
}
