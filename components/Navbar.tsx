"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex gap-6">
      <Link href="/">Linguiny</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/profile">Profile</Link>
    </nav>
  );
}