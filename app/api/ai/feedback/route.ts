import { sanitizeText, enforceRateLimit } from "@/lib/security";

export async function POST(req: Request) {
  // Check for required environment variables
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set");
    return Response.json(
      { feedback: "AI service is not configured. Please ensure GROQ_API_KEY is set in environment variables." },
      { status: 503 }
    );
  }

  const rateLimit = enforceRateLimit(req, "/api/ai/feedback", 20, 60_000);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ feedback: "Rate limit exceeded. Try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(rateLimit.retryAfter ?? 60) },
    });
  }

  const { question, userAnswer, correctAnswer } = await req.json();
  const safeQuestion = sanitizeText(question, 1000);
  const safeUserAnswer = sanitizeText(userAnswer, 1000);
  const safeCorrectAnswer = sanitizeText(correctAnswer, 1000);

  if (!safeQuestion || !safeUserAnswer || !safeCorrectAnswer) {
    return new Response(JSON.stringify({ feedback: "Invalid feedback request." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt = `You are a helpful language tutor. Explain briefly why the answer is correct or incorrect in 1-2 sentences.

Question: ${safeQuestion}
User Answer: ${safeUserAnswer}
Correct Answer: ${safeCorrectAnswer}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.5,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", JSON.stringify(data));
      return Response.json(
        { feedback: `AI error: ${data?.error?.message ?? response.statusText}` },
        { status: 500 }
      );
    }

    const feedback =
      data?.choices?.[0]?.message?.content?.trim() ?? "No AI response.";

    return Response.json({ feedback });
  } catch (error) {
    console.error("Groq AI error:", error);
    return Response.json(
      { feedback: "AI service error. Please try again." },
      { status: 500 }
    );
  }
}
