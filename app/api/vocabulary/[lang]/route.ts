import { NextRequest, NextResponse } from "next/server";
import { vocabularyData } from "@/lib/vocabularyData";
import { type LangCode } from "@/lib/languages";

// GET /api/vocabulary/:lang?category=Verbs&known=true
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const known = searchParams.get("known");

  if (!vocabularyData[lang as LangCode]) {
    return NextResponse.json(
      { error: "Invalid language. Must be one of: ja, en, es, fr" },
      { status: 400 }
    );
  }

  let words = vocabularyData[lang as LangCode];

  if (category) {
    words = words.filter((w) => w.category.toLowerCase() === category.toLowerCase());
  }

  if (known === "true") {
    words = words.filter((w) => w.known);
  } else if (known === "false") {
    words = words.filter((w) => !w.known);
  }

  return NextResponse.json({ lang, words, total: words.length });
}
