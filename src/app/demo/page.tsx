"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [loadingNonBlock, setLoadingNonBlock] = useState(false);

  const handleBlocking = async () => {
    setLoadingBlock(true);
    await fetch("/api/demo/blocking", { method: "POST" });
    setLoadingBlock(false);
  };

  const handleNonblocking = async () => {
    setLoadingNonBlock(true);
    await fetch("/api/demo/nonblocking", { method: "POST" });
    setLoadingNonBlock(false);
  };

  const handleClientError = async () => {
    throw new Error("Client error");
  };

  const handleApiError = async () => {
    await fetch("/api/demo/error", { method: "POST" });
  };

  const handleInngestError = async () => {
    await fetch("/api/demo/inngest-error", { method: "POST" });
  };

  return (
    <div className="space-x-4 p-8">
      <Button disabled={loadingBlock} onClick={handleBlocking}>
        {loadingBlock ? "Loading..." : "Blocking"}
      </Button>
      <Button disabled={loadingNonBlock} onClick={handleNonblocking}>
        {loadingNonBlock ? "Loading..." : "Non-Blocking"}
      </Button>
      <Button onClick={handleClientError} variant="destructive">
        Client Error
      </Button>
      <Button onClick={handleApiError} variant="destructive">
        API Error
      </Button>
      <Button onClick={handleInngestError} variant="destructive">
        Inngest Error
      </Button>
    </div>
  );
}
