import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { DEFAULT_CONVERSATION_TITLE } from "@/features/conversations/constants";

import { api } from "../../../../../convex/_generated/api";

const requestSchema = z.object({
  projectName: z.string().min(1),
  prompt: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const internalKey = process.env.ZENITH_CONVEX_INTERNAL_KEY;

  if (!internalKey) {
    return NextResponse.json(
      {
        error: "Internal key not configured",
      },
      { status: 500 },
    );
  }

  const body = await request.json();
  const { projectName, prompt } = requestSchema.parse(body);

  // Create project and conversation together
  const { projectId, conversationId } = await convex.mutation(
    api.system.createProjectWithConversation,
    {
      internalKey,
      projectName,
      conversationTitle: DEFAULT_CONVERSATION_TITLE,
      ownerId: userId,
    },
  );

  // Create user message
  await convex.mutation(api.system.createMessage, {
    internalKey,
    conversationId,
    projectId,
    role: "user",
    content: prompt,
  });

  // Create assistant message placeholder with processing status
  const assistantMessageId = await convex.mutation(api.system.createMessage, {
    internalKey,
    conversationId,
    projectId,
    role: "assistant",
    content: "",
    status: "processing",
  });

  // Trigger Inngest to process message
  await inngest.send({
    name: "message/sent",
    data: {
      messageId: assistantMessageId,
      conversationId,
      projectId,
      message: prompt,
    },
  });

  return NextResponse.json({ projectId });
}
