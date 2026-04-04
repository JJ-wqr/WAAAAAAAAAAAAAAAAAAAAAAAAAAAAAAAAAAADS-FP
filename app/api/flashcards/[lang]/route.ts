import { NextRequest, NextResponse } from "next/server";
import { flashcardDecks } from "@/lib/flashcardData";
import { type LangCode } from "@/lib/languages";

// GET /api/flashcards/:lang
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;

  if (!flashcardDecks[lang as LangCode]) {
    return NextResponse.json(
      { error: "Invalid language. Must be one of: ja, en, es, fr" },
      { status: 400 }
    );
  }

  const cards = flashcardDecks[lang as LangCode];
  return NextResponse.json({ lang, cards, total: cards.length });
}
