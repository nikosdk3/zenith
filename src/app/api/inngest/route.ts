import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { processMessage } from "@/features/conversations/inngest/process-message";
import { demoError, demoGenerate } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [demoGenerate, demoError, processMessage],
});
