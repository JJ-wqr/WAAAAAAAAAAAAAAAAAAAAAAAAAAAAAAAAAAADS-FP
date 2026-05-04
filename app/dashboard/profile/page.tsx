"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Globe, Bell, Shield, Palette } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "@/components/authprovider";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { ProfileHeader } from "./_components/ProfileHeader";
import { AchievementCard } from "./_components/AchievementCard";
import { ProfileStats } from "./_components/ProfileStats";
import { SettingsSection } from "./_components/SettingsSection";

const achievements = [
  { icon: "🔥", title: "Week Warrior", desc: "7-day streak", key: "streak", threshold: 7 },
  { icon: "📚", title: "Word Hoarder", desc: "1000 words learned", key: "wordsLearned", threshold: 1000 },
  { icon: "⚡", title: "XP Machine", desc: "5000 XP earned", key: "xp", threshold: 5000 },
  { icon: "🎯", title: "Lesson Master", desc: "10 lessons done", key: "lessonsCompleted", threshold: 10 },
  { icon: "🌍", title: "Polyglot", desc: "Learn 3 languages", key: null, threshold: null },
  { icon: "👑", title: "Top Learner", desc: "Reach #1 leaderboard", key: null, threshold: null },
];

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile" },
      { icon: Mail, label: "Change Email" },
      { icon: Shield, label: "Change Password" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Globe, label: "Interface Language" },
      { icon: Bell, label: "Notifications" },
      { icon: Palette, label: "Theme" },
    ],
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stats" | "achievements" | "settings">("stats");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) setUserData(snap.data());
    });
    return () => unsub();
  }, [user]);

  const displayLanguages: { flag: string; name: string; level: string; xp: number }[] =
    userData?.languages ?? [
      { flag: "🇯🇵", name: "Japanese", level: "Beginner", xp: 0 },
      { flag: "🇪🇸", name: "Spanish", level: "Beginner", xp: 0 },
      { flag: "🇫🇷", name: "French", level: "Beginner", xp: 0 },
    ];

  const initials = (user?.displayName ?? user?.email ?? "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="p-8 space-y-6">
      <ProfileHeader
        initials={initials}
        displayName={user?.displayName ?? userData?.name ?? "User"}
        email={user?.email}
        displayLanguages={displayLanguages}
        stats={{
          streak: String(userData?.streak ?? 0),
          xp: (userData?.xp ?? 0).toLocaleString(),
          words: String(userData?.wordsLearned ?? 0),
          lessons: String(userData?.lessonsCompleted ?? 0),
        }}
      />

      {/* Tabs */}
      <div className="flex gap-2">
        {(["stats", "achievements", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition ${
              activeTab === tab ? "text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
            style={activeTab === tab ? { background: "#4a7cf7" } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && <ProfileStats displayLanguages={displayLanguages} />}



      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.title} achievement={achievement} earned={achievement.key && achievement.threshold ? (userData?.[achievement.key] ?? 0) >= achievement.threshold : false} />
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <SettingsSection
          settingsSections={settingsSections}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
}
