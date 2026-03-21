"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useWebContainer } from "@/features/preview/hooks/use-webcontainer";

import { Id } from "../../../../convex/_generated/dataModel";
import { useProject } from "../hooks/use-projects";
import { Loader2Icon, RefreshCwIcon, TerminalSquareIcon } from "lucide-react";
import { PreviewSettingsPopover } from "@/features/preview/components/preview-settings-popover";

export const PreviewView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const project = useProject(projectId);
  const [showTerminal, setShowTerminal] = useState(true);

  const { status, previewUrl, error, restart, terminalOutput } =
    useWebContainer({
      projectId,
      enabled: true,
      settings: project?.settings,
    });

  const isLoading = status === "booting" || status === "installing";

  return (
    <div className="bg-background flex h-full flex-col">
      <div className="bg-sidebar flex h-8.75 shrink-0 items-center border-b">
        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          disabled={isLoading}
          onClick={restart}
          title="Restart container"
        >
          <RefreshCwIcon className="size-3" />
        </Button>

        <div className="bg-background text-muted-foreground flex h-full flex-1 items-center truncate border-x px-3 font-mono text-xs">
          {isLoading && (
            <div className="flex items-center gap-1.5">
              <Loader2Icon className="size-3 animate-spin" />
              {status === "booting" ? "Starting..." : "Installing..."}
            </div>
          )}
          {previewUrl && <span className="truncate">{previewUrl}</span>}
          {!isLoading && !previewUrl && !error && <span>Ready to preview</span>}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          title="Toggle terminal"
          onClick={() => setShowTerminal((value) => !value)}
        >
          <TerminalSquareIcon className="size-3" />
        </Button>
        <PreviewSettingsPopover
          projectId={projectId}
          initialValues={project?.settings}
          onSave={restart}
        />
      </div>
    </div>
  );
};
