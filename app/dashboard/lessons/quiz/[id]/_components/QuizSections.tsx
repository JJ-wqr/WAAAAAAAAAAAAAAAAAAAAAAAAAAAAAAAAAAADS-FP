"use client";

import { CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw } from "lucide-react";

export function QuizHeader({ langInfo, title, xp, current, total }: { langInfo: any; title: string; xp: number; current: number; total: number }) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">{langInfo.flag} {langInfo.name} · {title}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Question {current + 1} of {total}</span>
        <span className="text-xs text-blue-500 font-semibold bg-blue-50 px-3 py-1 rounded-full">+{xp} XP on completion</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(current / total) * 100}%`, background: "#4a7cf7" }} />
      </div>
    </div>
  );
}

export function QuizOptionList({ q, selected, setSelected, confirmed }: any) {
  return (
    <div className="space-y-3">
      {q.options.map((opt: string, i: number) => {
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
  );
}

export function QuizResultScreen({ finalScore, pct, xp, saveError, router, setCurrent, setSelected, setConfirmed, setScore, setFinished, setSavedXp, setEarnedXpDisplay, title }: any) {
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
            <p className="text-2xl font-bold text-green-500">{finalScore}/{xp}</p>
            <p className="text-xs text-gray-500 mt-1">Correct</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-2xl font-bold text-purple-500">+{xp}</p>
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
