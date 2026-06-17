// app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

  // Aggregate total XP per user from quiz attempts
  const xpAggregates = await prisma.quizAttempt.groupBy({
    by: ["userId"],
    _sum: { xpEarned: true },
    orderBy: { _sum: { xpEarned: "desc" } },
    take: limit,
  });

  if (xpAggregates.length === 0) {
    return NextResponse.json({ leaderboard: [], total: 0 });
  }

  const userIds = xpAggregates.map((a) => a.userId);

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      name: true,
      image: true,
      // email intentionally excluded — PII should not be public
    },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  const leaderboard = xpAggregates
    .map((agg, index) => {
      const user = userMap.get(agg.userId);
      if (!user) return null;
      return {
        rank: index + 1,
        id: user.id,
        name: user.name,
        image: user.image,
        totalXp: agg._sum.xpEarned ?? 0,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ leaderboard, total: leaderboard.length });
}