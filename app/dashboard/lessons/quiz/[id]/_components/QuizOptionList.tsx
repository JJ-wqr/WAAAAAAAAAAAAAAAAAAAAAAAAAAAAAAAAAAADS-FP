"use client";
import { CheckCircle2, XCircle } from "lucide-react";

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
