import Groq from "groq-sdk";
import { NextResponse } from "next/server";

require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt =
  "You are an expert programming chat bot assistant. Your task is to provide clear, concise, and accurate answers to technical questions about programming. Use examples where necessary and ensure your explanations are easy to understand. Do not provide code as am example. Provide answer without hypermarkups.";

export async function POST(req) {
  const data = await req.json();

  let response;
  try {
    response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...data,
      ],
      model: "llama3-8b-8192",
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return new NextResponse(JSON.stringify({ error: "No content returned" }), {
      status: 500,
    });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const text = encoder.encode(content);
      controller.enqueue(text);
      controller.close();
    },
  });

  return new NextResponse(stream);
}
