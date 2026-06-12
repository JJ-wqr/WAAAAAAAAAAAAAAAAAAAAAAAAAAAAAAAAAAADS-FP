"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/authprovider";
import { useLang } from "@/components/languageprovider";
import { LANGUAGES, progressKey } from "@/lib/languages";
import { LESSON_SKILLS, type SkillCategory } from "@/lib/lessonData";
import { db } from "@/lib/firebase";
import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardStatCards } from "./_components/DashboardStatCard";
import { DashboardGoalsCard } from "./_components/DashboardGoalsCard";
import { DashboardLanguagesCard } from "./_components/DashboardLanguages";
import { DashboardRecentActivity } from "./_components/DashboardRecentActivity";

export default function DashboardPage() {
  const { user } = useAuth();
  const { lang: selectedLangCode, setLang: setSelectedLangCode } = useLang();
  const [userData, setUserData] = useState<any>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const missing: Record<string, unknown> = {};
        if (!data.dailyGoals) missing.dailyGoals = {
          completedLesson: false,
          reviewedFlashcards: false,
          learnedWords: false,
          listeningPractice: false,
        };
        if (!data.recentActivity) missing.recentActivity = [];
        if (!data.lessonProgress) missing.lessonProgress = { "1": "active" };
        if (!data.lessonScores) missing.lessonScores = {};
        if (Object.keys(missing).length > 0) updateDoc(docRef, missing);
        setUserData(data);
      } else {
        setDoc(docRef, {
          email: user.email,
          name: user.displayName ?? user.email,
          xp: 0,
          streak: 0,
          lessonsCompleted: 0,
          wordsLearned: 0,
          createdAt: new Date(),
          dailyGoals: { completedLesson: false, reviewedFlashcards: false, learnedWords: false, listeningPractice: false },
          lessonProgress: { "1": "active", "en_1": "active", "es_1": "active", "fr_1": "active" },
          lessonScores: {},
          languageXp: { ja: 0, en: 0, es: 0, fr: 0 },
          recentActivity: [],
        }).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const lessonScores: Record<string, number> = userData?.lessonScores ?? {};
  const skillTotals: Record<SkillCategory, { sum: number; count: number }> = {
    reading: { sum: 0, count: 0 },
    writing: { sum: 0, count: 0 },
    listening: { sum: 0, count: 0 },
    speaking: { sum: 0, count: 0 },
  };
  for (const [id, category] of Object.entries(LESSON_SKILLS)) {
    const score = lessonScores[progressKey(selectedLangCode, id)];
    if (score === undefined) continue;
    skillTotals[category].sum += score;
    skillTotals[category].count += 1;
  }
  const skillValue = (category: SkillCategory) => {
    const { sum, count } = skillTotals[category];
    return count > 0 ? Math.round(sum / count) : 0;
  };

  const displaySkills = [
    { name: "Reading", value: skillValue("reading"), color: "#4a7cf7" },
    { name: "Writing", value: skillValue("writing"), color: "#a78bfa" },
    { name: "Listening", value: skillValue("listening"), color: "#34d399" },
    { name: "Speaking", value: skillValue("speaking"), color: "#f59e0b" },
  ];

  const displayDailyGoals = [
    { label: "Complete 1 Lesson", done: userData?.dailyGoals?.completedLesson ?? false },
    { label: "Review 20 Flashcards", done: userData?.dailyGoals?.reviewedFlashcards ?? false },
    { label: "Learn 10 New Words", done: userData?.dailyGoals?.learnedWords ?? false },
    { label: "10-min Listening Practice", done: userData?.dailyGoals?.listeningPractice ?? false },
  ];

  const langXp: Record<string, number> = userData?.languageXp ?? {};
  const displayLanguages = LANGUAGES.map((l) => {
    const xp = langXp[l.code] ?? 0;
    const level = xp >= 800 ? "Advanced" : xp >= 400 ? "Intermediate" : "Beginner";
    return { ...l, xp, level, maxXp: 1000 };
  });

  const recentActivity: { action: string; lang: string; time: string; xp: string }[] =
    [...(userData?.recentActivity ?? [])].reverse().slice(0, 4);

  const selectedLang = LANGUAGES.find((l) => l.code === selectedLangCode) ?? LANGUAGES[0];
  const goalsDone = displayDailyGoals.filter((g) => g.done).length;
  const goalsTotal = displayDailyGoals.length;

  return (
    <div className="p-8 space-y-8">
      <DashboardHeader
        user={user}
        now={now}
        selectedLangCode={selectedLangCode}
        setSelectedLangCode={setSelectedLangCode}
      />
      <DashboardStatCards userData={userData} />
      <DashboardGoalsCard
        displaySkills={displaySkills}
        selectedLang={selectedLang}
        displayDailyGoals={displayDailyGoals}
        goalsDone={goalsDone}
        goalsTotal={goalsTotal}
      />
      <div className="grid grid-cols-3 gap-6">
        <DashboardLanguagesCard displayLanguages={displayLanguages} />
        <DashboardRecentActivity recentActivity={recentActivity} />
      </div>
    </div>
  );
}
