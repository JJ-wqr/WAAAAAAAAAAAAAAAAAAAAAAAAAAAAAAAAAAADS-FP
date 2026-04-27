export async function POST(req: Request) {
  const { question, userAnswer, correctAnswer, lang } = await req.json();

  const prompt = `
You are a helpful language tutor.

Explain briefly why the answer is correct or incorrect.

Question: ${question}
User Answer: ${userAnswer}
Correct Answer: ${correctAnswer}

Keep it under 2 sentences.
`;

  try {
    console.log("CALLING:", "https://api-inference.huggingface.co/models/google/flan-t5-base");
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
        cache: "no-store",
      }
    );

    const text = await response.text();

    console.log("RAW RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Not JSON response:", text);
      return Response.json({
        feedback: "AI service error. Please try again.",
      });
    }

    console.log("HF RESPONSE:", data);

    let feedback = "No AI response.";

    if (Array.isArray(data) && data[0]?.generated_text) {
      feedback = data[0].generated_text;
    } else if (data?.error) {
      feedback = "AI is loading, try again.";
    }

    return Response.json({ feedback });

  } catch (error) {
    console.error(error);
    return Response.json(
      { feedback: "Failed to generate explanation." },
      { status: 500 }
    );
  }
}