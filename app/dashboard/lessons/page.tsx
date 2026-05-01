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
import { LessonTabs } from "./_components/LessonTabs";
import { LessonUnitCard } from "./_components/LessonUnitCard";
import { LessonRow } from "./_components/LessonRow";

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
      <LessonTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

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
            <LessonUnitCard
              key={unit.unit}
              unit={unit}
              filtered={filtered}
              getStatus={getStatus}
              getScore={getScore}
              handleStartLesson={handleStartLesson}
            />
          );
        })}
      </div>
    </div>
  );
}
