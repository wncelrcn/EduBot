import Groq from "groq-sdk";
import { NextResponse } from "next/server";

require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  const data = await req.json();
  const { messages, systemPrompt } = data;

  let response;
  try {
    response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
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
