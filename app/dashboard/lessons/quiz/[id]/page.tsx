"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { useAuth } from "@/components/authprovider";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { lessonQuizzes } from "@/lib/lessonData";
import { type LangCode, getLangInfo, progressKey } from "@/lib/languages";

const SEQUENCE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReview = searchParams.get("review") === "1";
  const lang = (searchParams.get("lang") ?? "ja") as LangCode;
  const { user } = useAuth();

  const langQuizzes = lessonQuizzes[lang] ?? lessonQuizzes["ja"];
  const quiz = langQuizzes[id] ?? langQuizzes["1"];
  const { title, xp, questions } = quiz;
  const langInfo = getLangInfo(lang);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedXp, setSavedXp] = useState(false);
  const [earnedXpDisplay, setEarnedXpDisplay] = useState(xp);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingSave, setPendingSave] = useState<{ updates: Record<string, unknown>; earnedXp: number } | null>(null);

  const q = questions[current];
  const isCorrect = selected === q.answer;
  const progress = (current / questions.length) * 100;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === q.answer) setScore((s) => s + 1);
  };

  const buildUpdates = (earnedXp: number, pct: number) => {
    const currentIdx = SEQUENCE.indexOf(Number(id));
    const nextId = SEQUENCE[currentIdx + 1];
    const pKey = progressKey(lang, id);
    const updates: Record<string, unknown> = {
      xp: increment(earnedXp),
      lessonsCompleted: increment(1),
      "dailyGoals.completedLesson": true,
      [`lessonProgress.${pKey}`]: "done",
      [`lessonScores.${pKey}`]: pct,
      [`languageXp.${lang}`]: increment(earnedXp),
      recentActivity: arrayUnion({
        action: `${title} – ${pct}%`,
        lang: `${langInfo.flag} ${langInfo.name}`,
        time: new Date().toISOString(),
        xp: `+${earnedXp} XP`,
      }),
    };
    if (nextId) updates[`lessonProgress.${progressKey(lang, nextId)}`] = "active";
    return updates;
  };

  const executeSave = async (uid: string, updates: Record<string, unknown>) => {
    try {
      await updateDoc(doc(db, "users", uid), updates);
    } catch (e: any) {
      setSaveError(e?.code ?? e?.message ?? "Unknown error");
    }
  };

  // Retry save when user becomes available after quiz finishes
  useEffect(() => {
    if (!pendingSave || !user || savedXp) return;
    setSavedXp(true);
    setPendingSave(null);
    executeSave(user.uid, pendingSave.updates);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingSave]);

  const handleNext = async () => {
    if (current + 1 >= questions.length) {
      const finalScore = score;
      const pct = Math.round((finalScore / questions.length) * 100);
      const earnedXp = pct === 100 ? xp + 5 : pct >= 80 ? xp : pct >= 60 ? Math.round(xp * 0.75) : Math.round(xp * 0.5);
      setEarnedXpDisplay(earnedXp);
      setFinished(true);

      if (!isReview && !savedXp) {
        setSavedXp(true);
        const updates = buildUpdates(earnedXp, pct);
        if (user) {
          await executeSave(user.uid, updates);
        } else {
          // user not loaded yet — store and retry via useEffect
          setSavedXp(false);
          setPendingSave({ updates, earnedXp });
        }
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
          {saveError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-left">
              <strong>Save failed:</strong> {saveError}
            </div>
          )}
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
              <p className="text-2xl font-bold text-purple-500">+{earnedXpDisplay}</p>
              <p className="text-xs text-gray-500 mt-1">XP Earned</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setCurrent(0); setSelected(null); setConfirmed(false); setScore(0); setFinished(false); setSavedXp(false); setEarnedXpDisplay(xp); }}
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
      <div>
        <p className="text-sm text-gray-400 mb-1">{langInfo.flag} {langInfo.name} · {title}</p>
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
                {confirmed && i === q.answer && <CheckCircle2 size={18} className="text-green-500 shrink-0" />}
                {confirmed && i === selected && i !== q.answer && <XCircle size={18} className="text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>
        {confirmed && (
          <div className={`mt-5 p-4 rounded-xl text-sm font-medium ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {isCorrect ? "✅ Correct! Well done." : `❌ The correct answer is: ${q.options[q.answer]}`}
          </div>
        )}
      </div>

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
