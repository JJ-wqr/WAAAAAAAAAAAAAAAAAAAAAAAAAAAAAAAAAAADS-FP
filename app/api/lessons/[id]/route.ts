import { NextRequest, NextResponse } from "next/server";
import { unitData, lessonQuizzes } from "@/lib/lessonData";
import { type LangCode } from "@/lib/languages";

// GET /api/lessons/:id?lang=ja
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get("lang") ?? "ja") as LangCode;

  if (!unitData[lang]) {
    return NextResponse.json(
      { error: "Invalid language. Must be one of: ja, en, es, fr" },
      { status: 400 }
    );
  }

  const lessonId = parseInt(id);
  let lessonMeta = null;

  for (const unit of unitData[lang]) {
    const found = unit.lessons.find((l) => l.id === lessonId);
    if (found) {
      lessonMeta = { ...found, unit: unit.unit, unitTitle: unit.title };
      break;
    }
  }

  if (!lessonMeta) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const progressKey = lang === "ja" ? `${lessonId}` : `${lang}_${lessonId}`;
  const quiz = lessonQuizzes[lang]?.[progressKey] ?? null;

  return NextResponse.json({ lesson: lessonMeta, quiz });
}
