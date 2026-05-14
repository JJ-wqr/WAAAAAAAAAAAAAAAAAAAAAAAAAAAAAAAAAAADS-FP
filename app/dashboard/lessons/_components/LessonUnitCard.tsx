"use client";

import { LessonRow } from "./LessonRow";
import type { LessonMeta, UnitData } from "@/lib/lessonData";

type LessonUnitCardProps = {
  unit: UnitData;
  filteredLessons?: LessonMeta[];
  filtered?: LessonMeta[];
  getStatus: (id: number) => string;
  getScore: (id: number) => number | null;
  handleStartLesson: (lessonId: number, isReview: boolean) => void;
};

export function LessonUnitCard({ unit, filteredLessons = [], filtered, getStatus, getScore, handleStartLesson }: LessonUnitCardProps) {
  const lessons = filteredLessons.length ? filteredLessons : filtered ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "#4a7cf7" }}>
          {unit.unit}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">Unit {unit.unit}</p>
          <p className="text-xs text-gray-500">{unit.title}</p>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {lessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            status={getStatus(lesson.id)}
            score={getScore(lesson.id)}
            handleStartLesson={handleStartLesson}
          />
        ))}
      </div>
    </div>
  );
}
