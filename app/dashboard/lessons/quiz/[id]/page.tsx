"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { useAuth } from "@/components/authprovider";
import { doc, updateDoc, increment, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const lessonQuizzes: Record<string, { title: string; xp: number; questions: { question: string; options: string[]; answer: number }[] }> = {
  "4": {
    title: "Colors & Shapes",
    xp: 20,
    questions: [
      { question: "What is 赤 (あか) in English?", options: ["Blue", "Red", "Green", "Yellow"], answer: 1 },
      { question: "How do you say 'circle' in Japanese?", options: ["三角形", "四角形", "丸", "星"], answer: 2 },
      { question: "What color is 青 (あお)?", options: ["Red", "White", "Black", "Blue"], answer: 3 },
      { question: "What is 黄色 (きいろ) in English?", options: ["Pink", "Purple", "Yellow", "Orange"], answer: 2 },
      { question: "How do you say 'triangle' in Japanese?", options: ["丸", "三角形", "四角形", "星"], answer: 1 },
    ],
  },
  "5": {
    title: "Food & Drinks",
    xp: 20,
    questions: [
      { question: "What is ごはん (ご飯) in English?", options: ["Bread", "Rice", "Noodles", "Soup"], answer: 1 },
      { question: "How do you say 'water' in Japanese?", options: ["ジュース", "ミルク", "お茶", "水"], answer: 3 },
      { question: "What is パン (ぱん) in English?", options: ["Cake", "Cookie", "Bread", "Rice"], answer: 2 },
      { question: "How do you say 'delicious' in Japanese?", options: ["まずい", "おいしい", "からい", "あまい"], answer: 1 },
      { question: "What is 牛乳 (ぎゅうにゅう)?", options: ["Juice", "Tea", "Water", "Milk"], answer: 3 },
    ],
  },
  "1": {
    title: "Hello & Goodbye",
    xp: 10,
    questions: [
      { question: "How do you say 'Hello' in Japanese?", options: ["さようなら", "ありがとう", "こんにちは", "すみません"], answer: 2 },
      { question: "What does 'さようなら' mean?", options: ["Hello", "Thank you", "Sorry", "Goodbye"], answer: 3 },
      { question: "How do you say 'Good morning'?", options: ["こんばんは", "おはようございます", "こんにちは", "おやすみ"], answer: 1 },
      { question: "What does 'おやすみ' mean?", options: ["Good morning", "Good afternoon", "Goodnight", "Goodbye"], answer: 2 },
      { question: "How do you greet someone in the evening?", options: ["おはよう", "こんにちは", "こんばんは", "さようなら"], answer: 2 },
    ],
  },
  "2": {
    title: "Introductions",
    xp: 15,
    questions: [
      { question: "How do you say 'My name is...' in Japanese?", options: ["わたしは〜です", "わたしの〜", "〜がすきです", "〜をください"], answer: 0 },
      { question: "What does 'よろしくおねがいします' mean?", options: ["Goodbye", "Thank you", "Nice to meet you", "Sorry"], answer: 2 },
      { question: "How do you ask 'What is your name?'", options: ["おなまえはなんですか", "どこですか", "なんさいですか", "どうですか"], answer: 0 },
      { question: "What does 'はじめまして' mean?", options: ["See you later", "Nice to meet you", "Thank you", "Excuse me"], answer: 1 },
      { question: "How do you say 'I am a student'?", options: ["わたしはせんせいです", "わたしはがくせいです", "わたしはいしゃです", "わたしはかいしゃいんです"], answer: 1 },
    ],
  },
  "3": {
    title: "Numbers 1–10",
    xp: 10,
    questions: [
      { question: "What is 三 (さん)?", options: ["1", "2", "3", "4"], answer: 2 },
      { question: "How do you say '7' in Japanese?", options: ["ろく", "しち", "はち", "きゅう"], answer: 1 },
      { question: "What is 十 (じゅう)?", options: ["8", "9", "10", "6"], answer: 2 },
      { question: "How do you say '2' in Japanese?", options: ["いち", "に", "さん", "し"], answer: 1 },
      { question: "What does 五 mean?", options: ["3", "4", "5", "6"], answer: 2 },
    ],
  },
};

const DEFAULT_QUIZ = {
  title: "Lesson Quiz",
  xp: 15,
  questions: [
    { question: "What is the Japanese word for 'eat'?", options: ["飲む", "食べる", "見る", "行く"], answer: 1 },
    { question: "What does 学校 (がっこう) mean?", options: ["Hospital", "Library", "School", "Station"], answer: 2 },
    { question: "How do you say 'train' in Japanese?", options: ["バス", "電車", "タクシー", "自転車"], answer: 1 },
    { question: "What is 友達 (ともだち)?", options: ["Family", "Teacher", "Friend", "Stranger"], answer: 2 },
    { question: "What does 仕事 (しごと) mean?", options: ["School", "Home", "Work / Job", "Shop"], answer: 2 },
  ],
};

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReview = searchParams.get("review") === "1";
  const { user } = useAuth();

  const quiz = lessonQuizzes[id] ?? DEFAULT_QUIZ;
  const { title, xp, questions } = quiz;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedXp, setSavedXp] = useState(false);

  const q = questions[current];
  const isCorrect = selected === q.answer;
  const progress = ((current) / questions.length) * 100;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === q.answer) setScore((s) => s + 1);
  };

  const handleNext = async () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      if (user && !savedXp && !isReview) {
        setSavedXp(true);
        const finalScore = score + (isCorrect ? 1 : 0);
        const pct = Math.round((finalScore / questions.length) * 100);
        const earnedXp = pct === 100 ? xp + 5 : pct >= 80 ? xp : pct >= 60 ? Math.round(xp * 0.75) : Math.round(xp * 0.5);
        const SEQUENCE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const currentIdx = SEQUENCE.indexOf(Number(id));
        const nextId = SEQUENCE[currentIdx + 1];
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const currentProgress = snap.data()?.lessonProgress ?? {};
        const updates: Record<string, unknown> = {
          xp: increment(earnedXp),
          lessonsCompleted: increment(1),
          "dailyGoals.completedLesson": true,
          [`lessonProgress.${id}`]: "done",
          [`lessonScores.${id}`]: pct,
          recentActivity: arrayUnion({
            action: `${title} – ${pct}%`,
            lang: "🇯🇵 Japanese",
            time: new Date().toISOString(),
            xp: `+${earnedXp} XP`,
          }),
        };
        if (nextId && !currentProgress[String(nextId)]) {
          updates[`lessonProgress.${nextId}`] = "active";
        }
        await updateDoc(userRef, updates);
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  if (finished) {
    const finalScore = score;
    const pct = Math.round((finalScore / questions.length) * 100);
    return (
      <div className="p-8 flex items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-5">
            <Trophy size={36} className="text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Lesson Complete!</h2>
          <p className="text-gray-500 text-sm mb-6">{title}</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-2xl p-4">
              <p className="text-2xl font-bold text-blue-500">{pct}%</p>
              <p className="text-xs text-gray-500 mt-1">Score</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="text-2xl font-bold text-green-500">{finalScore}/{questions.length}</p>
              <p className="text-xs text-gray-500 mt-1">Correct</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4">
              <p className="text-2xl font-bold text-purple-500">+{xp}</p>
              <p className="text-xs text-gray-500 mt-1">XP Earned</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setCurrent(0); setSelected(null); setConfirmed(false); setScore(0); setFinished(false); setSavedXp(false); }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={15} /> Retry
            </button>
            <button
              onClick={() => router.push("/dashboard/lessons")}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: "#4a7cf7" }}
            >
              Back to Lessons <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-400 mb-1">🇯🇵 Japanese · {title}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Question {current + 1} of {questions.length}</span>
          <span className="text-xs text-blue-500 font-semibold bg-blue-50 px-3 py-1 rounded-full">+{xp} XP on completion</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "#4a7cf7" }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-8 text-center leading-snug">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50";
            if (confirmed) {
              if (i === q.answer) style = "border-green-400 bg-green-50 text-green-700";
              else if (i === selected) style = "border-red-400 bg-red-50 text-red-600";
              else style = "border-gray-100 bg-gray-50 text-gray-400";
            } else if (selected === i) {
              style = "border-blue-400 bg-blue-50 text-blue-700";
            }

            return (
              <button
                key={i}
                disabled={confirmed}
                onClick={() => setSelected(i)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-between ${style}`}
              >
                <span>{opt}</span>
                {confirmed && i === q.answer && <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />}
                {confirmed && i === selected && i !== q.answer && <XCircle size={18} className="text-red-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {confirmed && (
          <div className={`mt-5 p-4 rounded-xl text-sm font-medium ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {isCorrect ? "✅ Correct! Well done." : `❌ The correct answer is: ${q.options[q.answer]}`}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        {!confirmed ? (
          <button
            disabled={selected === null}
            onClick={handleConfirm}
            className="px-8 py-3 rounded-xl text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{ background: "#4a7cf7" }}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 flex items-center gap-2"
            style={{ background: "#4a7cf7" }}
          >
            {current + 1 >= questions.length ? "See Results" : "Next Question"} <ChevronRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
