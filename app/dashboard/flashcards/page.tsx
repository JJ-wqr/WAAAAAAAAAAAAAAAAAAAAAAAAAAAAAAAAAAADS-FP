"use client";
import { useState } from "react";
import { RotateCcw, ThumbsUp, ThumbsDown, Zap, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/authprovider";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

const deck = [
  { front: "食べる", hint: "taberu", back: "to eat", example: "私は毎日ご飯を食べる。\n(I eat rice every day.)" },
  { front: "飲む", hint: "nomu", back: "to drink", example: "水を飲む。\n(I drink water.)" },
  { front: "学校", hint: "gakkō", back: "school", example: "学校に行く。\n(I go to school.)" },
  { front: "電車", hint: "densha", back: "train", example: "電車で来た。\n(I came by train.)" },
  { front: "友達", hint: "tomodachi", back: "friend", example: "友達と遊ぶ。\n(I play with friends.)" },
  { front: "仕事", hint: "shigoto", back: "work / job", example: "仕事が好きです。\n(I like my job.)" },
];

const SESSION_XP = 15;

export default function FlashcardsPage() {
  const { user } = useAuth();
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
          "dailyGoals.reviewedFlashcards": true,
          recentActivity: arrayUnion({
            action: `Flashcard Session – ${total} cards`,
            lang: "🇯🇵 Japanese",
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
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Complete!</h2>
          <p className="text-gray-500 mb-6">You reviewed {total} cards.</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-500">{known.length}</p>
              <p className="text-sm text-gray-500">Knew it</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-red-400">{unknown.length}</p>
              <p className="text-sm text-gray-500">Need practice</p>
            </div>
          </div>
          <button
            onClick={restart}
            className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: "#4a7cf7" }}
          >
            <RotateCcw size={16} /> Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Flashcards</h1>
        <p className="text-gray-500 text-sm mt-1">Tap the card to reveal the answer.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="text-blue-500 font-semibold">{index} / {total}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(index / total) * 100}%`, background: "#4a7cf7" }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-500 font-semibold flex items-center gap-1">
            <ThumbsUp size={14} /> {known.length}
          </span>
          <span className="text-red-400 font-semibold flex items-center gap-1">
            <ThumbsDown size={14} /> {unknown.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-blue-400 font-semibold bg-blue-50 px-3 py-1.5 rounded-full">
          <Zap size={12} /> +15 XP
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div
          className="w-full max-w-lg cursor-pointer select-none"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className="relative w-full transition-all duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              height: "280px",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center p-8"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Japanese → English</p>
              <p className="text-6xl font-bold text-gray-800 mb-3">{card.front}</p>
              <p className="text-lg text-gray-400">{card.hint}</p>
              <p className="text-xs text-gray-300 mt-6">Tap to reveal</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-white"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: "linear-gradient(135deg, #4a7cf7, #7c3aed)",
              }}
            >
              <p className="text-xs text-white/60 uppercase tracking-widest mb-4">Meaning</p>
              <p className="text-3xl font-bold mb-4">{card.back}</p>
              <div className="bg-white/10 rounded-xl p-4 text-center max-w-xs">
                <p className="text-sm text-white/80 whitespace-pre-line">{card.example}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      {flipped && (
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleKnow(false)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold transition hover:opacity-90 active:scale-95"
            style={{ background: "#f87171" }}
          >
            <ThumbsDown size={18} /> Still Learning
          </button>
          <button
            onClick={() => handleKnow(true)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold transition hover:opacity-90 active:scale-95"
            style={{ background: "#34d399" }}
          >
            <ThumbsUp size={18} /> Got It!
          </button>
        </div>
      )}

      {!flipped && (
        <div className="flex justify-center">
          <p className="text-sm text-gray-400">Click the card to flip it</p>
        </div>
      )}
    </div>
  );
}
