export async function POST(req: Request) {
  const { question, userAnswer, correctAnswer } = await req.json();

  const prompt = `You are a helpful language tutor. Explain briefly why the answer is correct or incorrect in 1-2 sentences.

Question: ${question}
User Answer: ${userAnswer}
Correct Answer: ${correctAnswer}`;

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
