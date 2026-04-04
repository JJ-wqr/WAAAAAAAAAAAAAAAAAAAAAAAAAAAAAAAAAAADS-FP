"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = name || email.split("@")[0];
      await updateProfile(result.user, { displayName });

      const userRef = doc(db, "users", result.user.uid);
      setDoc(userRef, {
        email: result.user.email,
        name: displayName,
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

      // Fire-and-forget — don't block registration on Prisma sync
      fetch("/api/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          name: displayName,
          image: null,
        }),
      }).catch(() => {});

      router.push("/?registered=1");
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(err?.message ?? "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #5b9cf6 0%, #7ab3f7 40%, #93c5fd 70%, #bfdbfe 100%)" }}
    >
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
          <path fill="rgba(59,130,246,0.3)" d="M0,100L60,110C120,120,240,140,360,135C480,130,600,100,720,95C840,90,960,110,1080,115C1200,120,1320,110,1380,105L1440,100L1440,200L0,200Z" />
        </svg>
        <svg viewBox="0 0 1440 160" className="w-full absolute bottom-0" preserveAspectRatio="none">
          <path fill="rgba(37,99,235,0.2)" d="M0,160L80,149C160,139,320,117,480,122C640,128,800,160,960,165C1120,171,1280,149,1360,139L1440,128L1440,160L0,160Z" />
        </svg>
      </div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: "#4a7cf7" }}>
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: "#4a7cf7" }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link href="/" className="font-medium hover:underline" style={{ color: "#4a7cf7" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
