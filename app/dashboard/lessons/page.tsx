"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Lock, CheckCircle2, Clock, Star, ChevronRight, BookOpen } from "lucide-react";
import { useAuth } from "@/components/authprovider";
import { useLang } from "@/components/languageprovider";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { unitData } from "@/lib/lessonData";
import { progressKey } from "@/lib/languages";

const tabs = ["All", "In Progress", "Completed", "Locked"];

export default function LessonsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState("All");
  const [lessonProgress, setLessonProgress] = useState<Record<string, string>>({});
  const [lessonScores, setLessonScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (!data.lessonProgress) {
          updateDoc(docRef, { lessonProgress: { "1": "active" }, lessonScores: {} });
        } else {
          setLessonProgress(data.lessonProgress);
          setLessonScores(data.lessonScores ?? {});
        }
      }
    });
    return () => unsubscribe();
  }, [user]);

  const getStatus = (id: number) => {
    const key = progressKey(lang, id);
    const val = lessonProgress[key];
    if (val) return val;
    // Lesson 1 is always available for all languages
    if (id === 1) return "active";
    return "locked";
  };

  const getScore = (id: number): number | null => lessonScores[progressKey(lang, id)] ?? null;

  const units = unitData[lang];
  const allLessons = units.flatMap((u) => u.lessons);
  const completedCount = allLessons.filter((l) => getStatus(l.id) === "done").length;
  const inProgressCount = allLessons.filter((l) => getStatus(l.id) === "active").length;

  const handleStartLesson = (lessonId: number, isReview: boolean) => {
    router.push(`/dashboard/lessons/quiz/${lessonId}?lang=${lang}${isReview ? "&review=1" : ""}`);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Lessons</h1>
        <p className="text-gray-500 text-sm mt-1">Continue your learning journey step by step.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Completed", value: String(completedCount), icon: CheckCircle2, color: "#34d399", bg: "#ecfdf5" },
          { label: "In Progress", value: String(inProgressCount), icon: Play, color: "#4a7cf7", bg: "#eef2ff" },
          { label: "Total Lessons", value: String(allLessons.length), icon: BookOpen, color: "#a78bfa", bg: "#f5f3ff" },
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
            const status = getStatus(l.id);
            if (activeTab === "All") return true;
            if (activeTab === "In Progress") return status === "active";
            if (activeTab === "Completed") return status === "done";
            if (activeTab === "Locked") return status === "locked";
            return true;
          });
          if (filtered.length === 0) return null;
          return (
            <div key={unit.unit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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

              <div className="divide-y divide-gray-50">
                {filtered.map((lesson) => {
                  const status = getStatus(lesson.id);
                  const score = getScore(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`px-6 py-4 flex items-center justify-between ${status === "locked" ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              status === "done" ? "#ecfdf5" :
                              status === "active" ? "#eef2ff" : "#f9fafb",
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
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
