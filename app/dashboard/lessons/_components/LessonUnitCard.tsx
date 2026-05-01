"use client";
import { LessonRow } from "./LessonRow";

export function LessonUnitCard({ unit, filteredLessons, getStatus, getScore, handleStartLesson }: any) {
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
        {filteredLessons.map((lesson: any) => (
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
