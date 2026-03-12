// lib/taskStore.ts
// Simple in-memory store to simulate a database for demo/testing purposes

export type Task = {
  id: string;
  title: string;
  description: string;
};

// Pre-seeded tasks so GET requests work immediately on first load
export const tasks: Task[] = [
  { id: "1", title: "task title", description: "task description" },
  { id: "2", title: "Learn Next.js", description: "Study the App Router docs" },
];

let nextId = 3;

export function getNextId(): string {
  return String(nextId++);
}