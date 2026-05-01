"use client";
import { Play, Lock, CheckCircle2, Clock, Star, ChevronRight } from "lucide-react";

export function LessonRow({ lesson, status, score, handleStartLesson }: {
  lesson: any;
  status: string;
  score: number | null;
  handleStartLesson: (lessonId: number, isReview: boolean) => void;
}) {
  return (
    <div className={`px-6 py-4 flex items-center justify-between ${status === "locked" ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background:
              status === "done" ? "#ecfdf5" : status === "active" ? "#eef2ff" : "#f9fafb",
          }}
        >
          {status === "done" && <CheckCircle2 size={20} style={{ color: "#34d399" }} />}
          {status === "active" && <Play size={20} style={{ color: "#4a7cf7" }} />}
          {status === "locked" && <Lock size={20} className="text-gray-400" />}
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">{lesson.title}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> {lesson.duration}</span>
            <span className="text-xs text-blue-400 font-medium flex items-center gap-1"><Star size={11} /> +{lesson.xp} XP</span>
            {score !== null && (
              <span className="text-xs text-green-500 font-medium">{score}%</span>
            )}
          </div>
        </div>
      </div>
      {status !== "locked" && (
        <button
          onClick={() => handleStartLesson(lesson.id, status === "done")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: status === "done" ? "#34d399" : "#4a7cf7" }}
        >
          {status === "done" ? "Review" : "Start"}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
