import { NextResponse } from "next/server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST() {
  const response = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "Write a vegetarian lasagna recipe for 4 people.",
    experimental_telemetry: {
      isEnabled: true,
    },
  });

  return NextResponse.json({ response });
}
