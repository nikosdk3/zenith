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

  return (
    <div className="space-x-4 p-8">
      <Button disabled={loadingBlock} onClick={handleBlocking}>
        {loadingBlock ? "Loading..." : "Blocking"}
      </Button>
      <Button disabled={loadingNonBlock} onClick={handleNonblocking}>
        {loadingNonBlock ? "Loading..." : "Non-Blocking"}
      </Button>
    </div>
  );
}
