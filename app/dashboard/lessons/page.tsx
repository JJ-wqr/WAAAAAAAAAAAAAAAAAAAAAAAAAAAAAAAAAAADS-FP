"use client";
import { useState } from "react";
import { Play, Lock, CheckCircle2, Clock, Star, ChevronRight, BookOpen } from "lucide-react";

const units = [
  {
    unit: 1,
    title: "Basics & Greetings",
    lessons: [
      { id: 1, title: "Hello & Goodbye", duration: "5 min", xp: 10, status: "done", score: 95 },
      { id: 2, title: "Introductions", duration: "8 min", xp: 15, status: "done", score: 88 },
      { id: 3, title: "Numbers 1–10", duration: "6 min", xp: 10, status: "done", score: 100 },
      { id: 4, title: "Colors & Shapes", duration: "10 min", xp: 20, status: "active", score: null },
    ],
  },
  {
    unit: 2,
    title: "Daily Life",
    lessons: [
      { id: 5, title: "Food & Drinks", duration: "12 min", xp: 20, status: "active", score: null },
      { id: 6, title: "At the Market", duration: "10 min", xp: 20, status: "locked", score: null },
      { id: 7, title: "Time & Days", duration: "8 min", xp: 15, status: "locked", score: null },
    ],
  },
  {
    unit: 3,
    title: "Grammar Foundations",
    lessons: [
      { id: 8, title: "Present Tense", duration: "15 min", xp: 25, status: "locked", score: null },
      { id: 9, title: "Past Tense", duration: "18 min", xp: 30, status: "locked", score: null },
      { id: 10, title: "Question Forms", duration: "12 min", xp: 25, status: "locked", score: null },
    ],
  },
];

const tabs = ["All", "In Progress", "Completed", "Locked"];

export default function LessonsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Lessons</h1>
        <p className="text-gray-500 text-sm mt-1">Continue your learning journey step by step.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Completed", value: "3", icon: CheckCircle2, color: "#34d399", bg: "#ecfdf5" },
          { label: "In Progress", value: "2", icon: Play, color: "#4a7cf7", bg: "#eef2ff" },
          { label: "Total Lessons", value: "10", icon: BookOpen, color: "#a78bfa", bg: "#f5f3ff" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab ? "text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
            style={activeTab === tab ? { background: "#4a7cf7" } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Units */}
      <div className="space-y-6">
        {units.map((unit) => {
          const filtered = unit.lessons.filter((l) => {
            if (activeTab === "All") return true;
            if (activeTab === "In Progress") return l.status === "active";
            if (activeTab === "Completed") return l.status === "done";
            if (activeTab === "Locked") return l.status === "locked";
            return true;
          });
          if (filtered.length === 0) return null;
          return (
            <div key={unit.unit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Unit Header */}
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "#4a7cf7" }}
                >
                  {unit.unit}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Unit {unit.unit}</p>
                  <p className="text-xs text-gray-500">{unit.title}</p>
                </div>
              </div>

              {/* Lessons */}
              <div className="divide-y divide-gray-50">
                {filtered.map((lesson) => (
                  <div key={lesson.id} className={`px-6 py-4 flex items-center justify-between ${lesson.status === "locked" ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-4">
                      {/* Status icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            lesson.status === "done" ? "#ecfdf5" :
                            lesson.status === "active" ? "#eef2ff" : "#f9fafb",
                        }}
                      >
                        {lesson.status === "done" && <CheckCircle2 size={20} style={{ color: "#34d399" }} />}
                        {lesson.status === "active" && <Play size={20} style={{ color: "#4a7cf7" }} />}
                        {lesson.status === "locked" && <Lock size={20} className="text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{lesson.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> {lesson.duration}</span>
                          <span className="text-xs text-blue-400 font-medium flex items-center gap-1"><Star size={11} /> +{lesson.xp} XP</span>
                          {lesson.score && (
                            <span className="text-xs text-green-500 font-medium">{lesson.score}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {lesson.status !== "locked" && (
                      <button
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                        style={{ background: lesson.status === "done" ? "#34d399" : "#4a7cf7" }}
                      >
                        {lesson.status === "done" ? "Review" : "Start"}
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
