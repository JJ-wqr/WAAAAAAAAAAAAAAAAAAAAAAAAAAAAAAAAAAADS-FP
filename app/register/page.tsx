"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = (e) => {
    e.preventDefault()

    const user = { email, password }

    localStorage.setItem("user", JSON.stringify(user))
    alert("Registered successfully!")
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login-background.png')" }}>
      <div className="bg-white p-10 rounded-xl w-[400px] shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Register
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border p-2 rounded text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}