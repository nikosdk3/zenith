import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(prompt: string) {
  await inngest.send({
    name: "demo/generate",
    data: {
      prompt,
    },
  });

  return NextResponse.json({ status: "started" });
}
