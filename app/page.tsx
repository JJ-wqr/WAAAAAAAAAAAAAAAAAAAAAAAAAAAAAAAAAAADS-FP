"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/app/_components/LoginForm";

export default function LoginPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      toast.success("Account created! You can now log in.");
    }
  }, [searchParams]);

  return <LoginForm />;
}
