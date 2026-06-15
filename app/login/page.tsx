"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import LoginForm from "@/app/_components/LoginForm";
import { PublicShell } from "@/components/PublicShell";

export default function LoginPage() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("registered") === "1") {
      toast.success("Account created! You can now log in.");
    }
  }, []);

  return (
    <PublicShell
      title="Sign in and continue your language journey"
      description="Access lessons, flashcards, conversation practice, and more with a clean, polished learning dashboard."
    >
      <LoginForm />
    </PublicShell>
  );
}
