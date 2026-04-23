import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const question = String(body.question ?? "");
  const userAnswer = String(body.userAnswer ?? "");
  const correctAnswer = String(body.correctAnswer ?? "");
  const lang = String(body.lang ?? "English");

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    return Response.json(
      { feedback: "Unable to generate explanation: missing API key." },
      { status: 500 }
    );
  }

  const prompt = `
Explain why the answer is correct or incorrect.

Question: ${question}
User Answer: ${userAnswer}
Correct Answer: ${correctAnswer}

Give a simple explanation for a beginner learning ${lang}.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a language tutor." },
        { role: "user", content: prompt },
      ],
    });

    const feedback =
      completion.choices?.[0]?.message?.content?.trim() ??
      "Unable to generate explanation.";

    return Response.json({ feedback });
  } catch (error) {
    console.error("AI feedback route error:", error);
    return Response.json(
      { feedback: "Unable to generate explanation." },
      { status: 500 }
    );
  }
}