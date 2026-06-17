// tests/frontend/form-validation.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/",
}));

// Mock Firebase auth
jest.mock("@/lib/firebase", () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((cb: (user: null) => void) => { cb(null); return jest.fn(); }),
  },
}));
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

import LoginForm from "../../app/_components/LoginForm";

describe("LoginForm — real component render tests", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it("shows validation error when email is empty on submit", async () => {
    render(<LoginForm />);
    const submitBtn = screen.getByRole("button", { name: /sign in|login|log in/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      // Form should block submission and show an error
      expect(screen.queryByText(/required|email|invalid/i)).toBeTruthy();
    });
  });

  it("shows error for invalid email format", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: "notanemail" } });
    const submitBtn = screen.getByRole("button", { name: /sign in|login|log in/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.queryByText(/valid email|invalid email|email format/i)).toBeTruthy();
    });
  });
});