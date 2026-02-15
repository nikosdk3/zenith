import { inngest } from "@/inngest/client";
import { Id } from "../../../../convex/_generated/dataModel";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";
import { NonRetriableError } from "inngest";

interface MessageEvent {
  messageId: Id<"messages">;
}

export const processMessage = inngest.createFunction(
  {
    id: "process-message",
    cancelOn: [
      {
        event: "message/cancel",
        if: "event.data.messageId == async.data.messageId",
      },
    ],
    onFailure: async ({ event, step }) => {
      const { messageId } = event.data.event.data as MessageEvent;
      const internalKey = process.env.ZENITH_CONVEX_INTERNAL_KEY;

      if (internalKey) {
        await step.run("update-message-on-faulure", async () => {
          await convex.mutation(api.system.updateMessageContent, {
            internalKey,
            messageId,
            content:
              "Sorry, I encountered an error while processing your request. Please try again.",
          });
        });
      }
    },
  },
  {
    event: "message/sent",
  },
  async ({ event, step }) => {
    const { messageId } = event.data as MessageEvent;

    const internalKey = process.env.ZENITH_CONVEX_INTERNAL_KEY;

    if (!internalKey) {
      throw new NonRetriableError(
        "ZENITH_CONVEX_INTERNAL_KEY is not configured",
      );
    }

    await step.sleep("wait-for-ai-processing", "50s");

    await step.run("update-assistant-message", async () => {
      await convex.mutation(api.system.updateMessageContent, {
        internalKey,
        messageId,
        content: "AI Processed this message (TODO)",
      });
    });
  },
);
