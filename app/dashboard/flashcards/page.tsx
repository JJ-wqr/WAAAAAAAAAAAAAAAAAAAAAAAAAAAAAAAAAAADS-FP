"use client";

import { useState, useMemo } from "react";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { useAuth } from "@/components/authprovider";
import { useLang } from "@/components/languageprovider";
import { db } from "@/lib/firebase";
import { flashcardDecks } from "@/lib/flashcardData";
import { getLangInfo } from "@/lib/languages";
import { notifyUserIfEnabled } from "@/lib/notifications";
import { useProgress } from "@/lib/progressContext";
import { FlashcardProgress } from "./_components/FlashcardProgress";
import { FlashcardCard } from "./_components/FlashcardCard";
import { FlashcardActions } from "./_components/FlashcardActions";
import { FlashcardResult } from "./_components/FlashcardResult";

const SESSION_XP = 15;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type FlashcardsPageProps = {
  onVocabularyUpdated?: () => Promise<void> | void;
};

export default function FlashcardsPage({ onVocabularyUpdated }: FlashcardsPageProps) {
  const { user } = useAuth();
  const { lang } = useLang();
  const langInfo = getLangInfo(lang);
  const { markKnown, markUnknown } = useProgress();

  const [reshuffleKey, setReshuffleKey] = useState(0);
  const deck  = useMemo(() => shuffle(flashcardDecks[lang] ?? []), [lang, reshuffleKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = deck.length;

  const [index, setIndex]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown]     = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [done, setDone]       = useState(false);

  const card = deck[index];

  const handleKnow = async (didKnow: boolean) => {
    // Sync mastery to shared context — matches by front === word
    if (didKnow) {
      setKnown((p) => [...p, index]);
      markKnown(lang, card.front);
    } else {
      setUnknown((p) => [...p, index]);
      markUnknown(lang, card.front);
    }

    if (onVocabularyUpdated) {
      await onVocabularyUpdated();
    }

    if (index + 1 >= total) {
      setDone(true);
      if (user) {
        const notificationItem = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title: "Flashcards complete!",
          body: `You earned +${SESSION_XP} XP in ${langInfo.name}.`,
          time: new Date().toISOString(),
          read: false,
          xp: `+${SESSION_XP} XP`,
          lang: `${langInfo.flag} ${langInfo.name}`,
        };
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
          "notifications.items": arrayUnion(notificationItem),
        });
        notifyUserIfEnabled(user.uid, notificationItem.title, notificationItem.body);
      }
    } else {
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  const restart = () => {
    setReshuffleKey(k => k + 1);
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
  };

  if (done) {
    return <FlashcardResult total={total} known={known.length} unknown={unknown.length} restart={restart} />;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Flashcards</h1>
        <p className="text-gray-500 text-sm mt-1">Tap the card to reveal the answer.</p>
      </div>
      <FlashcardProgress index={index} total={total} known={known.length} unknown={unknown.length} />
      <FlashcardCard langInfo={langInfo} lang={lang} card={card} flipped={flipped} setFlipped={setFlipped} />
      <FlashcardActions flipped={flipped} handleKnow={handleKnow} />
    </div>
  );
}
