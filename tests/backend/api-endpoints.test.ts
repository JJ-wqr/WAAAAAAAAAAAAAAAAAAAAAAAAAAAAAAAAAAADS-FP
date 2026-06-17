// tests/backend/api-endpoints.test.ts
// These tests import and call real Next.js route handlers.
import { createMockRequest } from "../utils";

// Mock firebase-admin so tests run without real credentials
jest.mock("firebase-admin/app", () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => [{}]),
  cert: jest.fn(),
}));

jest.mock("firebase-admin/auth", () => ({
  getAuth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockImplementation((token: string) => {
      if (token === "valid-token-user-abc") return Promise.resolve({ uid: "user-abc" });
      if (token === "valid-token-user-xyz") return Promise.resolve({ uid: "user-xyz" });
      return Promise.reject(new Error("Invalid token"));
    }),
  })),
}));

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    quizAttempt: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { prisma } from "../../lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("GET /api/users/[uid] — real route handler", () => {
  it("returns 401 for unauthenticated request", async () => {
    const { GET } = await import("../../app/api/users/[uid]/route");
    const req = await createMockRequest("GET", "http://localhost:3000/api/users/user-abc");
    const res = await GET(req, { params: Promise.resolve({ uid: "user-abc" }) });
    expect(res.status).toBe(401);
  });

  it("returns 403 when requesting another user's data", async () => {
    const { GET } = await import("../../app/api/users/[uid]/route");
    const req = await createMockRequest("GET", "http://localhost:3000/api/users/user-abc", undefined, {
      Authorization: "Bearer valid-token-user-xyz",
    });
    const res = await GET(req, { params: Promise.resolve({ uid: "user-abc" }) });
    expect(res.status).toBe(403);
  });

  it("returns 200 for authenticated owner request", async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-abc",
      email: "abc@example.com",
      name: "Test",
      image: null,
      role: "user",
    });

    const { GET } = await import("../../app/api/users/[uid]/route");
    const req = await createMockRequest("GET", "http://localhost:3000/api/users/user-abc", undefined, {
      Authorization: "Bearer valid-token-user-abc",
    });
    const res = await GET(req, { params: Promise.resolve({ uid: "user-abc" }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.id).toBe("user-abc");
  });
});

describe("GET /api/quiz/attempt/[attemptId] — formerly unprotected route", () => {
  it("returns 401 with no auth header", async () => {
    const { GET } = await import("../../app/api/quiz/attempt/[attemptId]/route");
    const req = await createMockRequest("GET", "http://localhost:3000/api/quiz/attempt/attempt-1");
    const res = await GET(req, { params: Promise.resolve({ attemptId: "attempt-1" }) });
    expect(res.status).toBe(401);
  });

  it("returns 403 when attempt belongs to another user", async () => {
    (mockPrisma.quizAttempt.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "attempt-1",
      userId: "user-abc",  // belongs to user-abc
      lessonId: 1,
      score: 80,
    });

    const { GET } = await import("../../app/api/quiz/attempt/[attemptId]/route");
    const req = await createMockRequest("GET", "http://localhost:3000/api/quiz/attempt/attempt-1", undefined, {
      Authorization: "Bearer valid-token-user-xyz",  // user-xyz requesting user-abc's data
    });
    const res = await GET(req, { params: Promise.resolve({ attemptId: "attempt-1" }) });
    expect(res.status).toBe(403);
  });
});