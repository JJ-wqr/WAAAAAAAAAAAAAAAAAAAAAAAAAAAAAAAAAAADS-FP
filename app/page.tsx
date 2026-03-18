"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create Firestore doc in background — don't block navigation
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((userSnap) => {
      if (!userSnap.exists()) {
        setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          xp: 0,
          streak: 0,
          lessonsCompleted: 0,
          wordsLearned: 0,
          createdAt: new Date(),
          skills: { reading: 0, writing: 0, listening: 0, speaking: 0 },
          dailyGoals: { completedLesson: false, reviewedFlashcards: false, learnedWords: false, listeningPractice: false },
          languages: [
            { code: "ja", name: "Japanese", flag: "🇯🇵", level: "Beginner", xp: 0, maxXp: 1000 },
            { code: "es", name: "Spanish", flag: "🇪🇸", level: "Beginner", xp: 0, maxXp: 1000 },
            { code: "fr", name: "French", flag: "🇫🇷", level: "Beginner", xp: 0, maxXp: 1000 },
          ],
          lessonProgress: { "1": "active" },
          lessonScores: {},
        });
      }
    }).catch(console.error);

    router.push("/dashboard");

  } catch (error: any) {
    console.error(error);
    alert(error.message ?? "Google sign-in failed. Please try again.");
  }
};
  const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/dashboard");
  } catch (error: any) {
    alert(error.message);
  }
};
  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, {
      email: result.user.email,
      name: result.user.displayName ?? email.split("@")[0],
      xp: 0,
      streak: 0,
      lessonsCompleted: 0,
      wordsLearned: 0,
      createdAt: new Date(),
      skills: { reading: 0, writing: 0, listening: 0, speaking: 0 },
      dailyGoals: { completedLesson: false, reviewedFlashcards: false, learnedWords: false, listeningPractice: false },
      languages: [
        { code: "ja", name: "Japanese", flag: "🇯🇵", level: "Beginner", xp: 0, maxXp: 1000 },
        { code: "es", name: "Spanish", flag: "🇪🇸", level: "Beginner", xp: 0, maxXp: 1000 },
        { code: "fr", name: "French", flag: "🇫🇷", level: "Beginner", xp: 0, maxXp: 1000 },
      ],
      lessonProgress: { "1": "active" },
      lessonScores: {},
    });
    router.push("/dashboard");
  } catch (error: any) {
    alert(error.message);
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #5b9cf6 0%, #7ab3f7 40%, #93c5fd 70%, #bfdbfe 100%)" }}
    >
      {/* Decorative wave */}
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
          Welcome Back
        </h1>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="someone@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition hover:opacity-90 active:scale-95"
            style={{ background: "#4a7cf7" }}
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
         type="button"
          onClick={handleRegister}
          className="w-full py-3 rounded-lg mt-3 border"
          style={{ borderColor: "#4a7cf7", color: "#4a7cf7" }}
        >
          Register
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg text-white font-semibold text-sm transition hover:opacity-90 active:scale-95"
          style={{ background: "#e53935" }}
        >
          Sign In with Google
        </button>



        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium hover:underline" style={{ color: "#4a7cf7" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
