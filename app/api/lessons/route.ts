import { NextRequest, NextResponse } from "next/server";
import { unitData } from "@/lib/lessonData";

// GET /api/lessons?lang=ja
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") as keyof typeof unitData | null;

  if (lang && !unitData[lang]) {
    return NextResponse.json(
      { error: "Invalid language. Must be one of: ja, en, es, fr" },
      { status: 400 }
    );
  }

  const data = lang ? { [lang]: unitData[lang] } : unitData;
  return NextResponse.json({ lessons: data });
}
