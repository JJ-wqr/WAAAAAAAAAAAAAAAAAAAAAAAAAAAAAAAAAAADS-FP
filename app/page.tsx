"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
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

        <form onSubmit={handleLogin} className="space-y-4">
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
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 rounded-lg text-white font-semibold text-sm transition hover:opacity-90 active:scale-95"
          style={{ background: "#e53935" }}
        >
          Continue with Google
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
