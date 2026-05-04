"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/authprovider";
import { useLang } from "@/components/languageprovider";
import { LANGUAGES } from "@/lib/languages";
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
        if (!data.skills) missing.skills = { reading: 0, writing: 0, listening: 0, speaking: 0 };
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
          skills: { reading: 0, writing: 0, listening: 0, speaking: 0 },
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

  const displaySkills = [
    { name: "Reading", value: userData?.skills?.reading ?? 0, color: "#4a7cf7" },
    { name: "Writing", value: userData?.skills?.writing ?? 0, color: "#a78bfa" },
    { name: "Listening", value: userData?.skills?.listening ?? 0, color: "#34d399" },
    { name: "Speaking", value: userData?.skills?.speaking ?? 0, color: "#f59e0b" },
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
