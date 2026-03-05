"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../lib/firebase"

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Failed to register. Please try again.")
    }
  }

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Failed to register with Google")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-background.png')" }}
    >
      <div className="bg-white p-10 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition">
              Register
            </button>
          </div>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 font-medium">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-lg transition flex items-center justify-center">
            Continue with Google
          </button>
        </form>

        <p className="text-center mt-6 text-gray-700">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}