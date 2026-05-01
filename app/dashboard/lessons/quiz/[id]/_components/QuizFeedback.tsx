"use client";

export function QuizFeedback({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
