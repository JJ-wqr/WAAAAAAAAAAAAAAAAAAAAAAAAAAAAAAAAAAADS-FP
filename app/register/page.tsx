"use client";
import RegisterForm from "@/app/register/_components/RegisterForm";
import { PublicShell } from "@/components/PublicShell";

export default function RegisterPage() {
  return (
    <PublicShell
      title="Create your language learning account"
      description="Join Linguiny and build daily habits with interactive lessons, flashcards, and real conversation practice."
    >
      <RegisterForm />
    </PublicShell>
  );
}
