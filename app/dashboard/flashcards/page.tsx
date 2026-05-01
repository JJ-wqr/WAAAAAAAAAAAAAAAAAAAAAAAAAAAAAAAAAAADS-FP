"use client";
import { useState } from "react";
import { RotateCcw, ThumbsUp, ThumbsDown, Zap, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/authprovider";
import { useLang } from "@/components/languageprovider";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { flashcardDecks } from "@/lib/flashcardData";
import { getLangInfo } from "@/lib/languages";
import { FlashcardProgress } from "./_components/FlashcardProgress";
import { FlashcardCard } from "./_components/FlashcardCard";
import { FlashcardActions } from "./_components/FlashcardActions";
import { FlashcardResult } from "./_components/FlashcardResult";

const SESSION_XP = 15;

export default function FlashcardsPage() {
  const { user } = useAuth();
  const { lang } = useLang();
  const deck = flashcardDecks[lang];
  const langInfo = getLangInfo(lang);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const card = deck[index];
  const total = deck.length;

  const handleKnow = (didKnow: boolean) => {
    if (didKnow) setKnown((p) => [...p, index]);
    else setUnknown((p) => [...p, index]);
    if (index + 1 >= total) {
      setDone(true);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        updateDoc(docRef, {
          xp: increment(SESSION_XP),
          [`languageXp.${lang}`]: increment(SESSION_XP),
          "dailyGoals.reviewedFlashcards": true,
          recentActivity: arrayUnion({
            action: `Flashcard Session – ${total} cards`,
            lang: `${langInfo.flag} ${langInfo.name}`,
            time: new Date().toISOString(),
            xp: `+${SESSION_XP} XP`,
          }),
        });
      }
    } else {
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
  };

  if (done) {
    return (
      <FlashcardResult
        total={total}
        known={known.length}
        unknown={unknown.length}
        restart={restart}
      />
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Flashcards</h1>
        <p className="text-gray-500 text-sm mt-1">Tap the card to reveal the answer.</p>
      </div>

      {/* Progress */}
      <FlashcardProgress index={index} total={total} known={known.length} unknown={unknown.length} />

      {/* Flashcard */}
      <FlashcardCard langInfo={langInfo} lang={lang} card={card} flipped={flipped} setFlipped={setFlipped} />

      {/* Buttons */}
      <FlashcardActions flipped={flipped} handleKnow={handleKnow} />
    </div>
  );
}
