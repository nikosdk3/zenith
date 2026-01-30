import { useFile } from "@/features/projects/hooks/use-files";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FileIcon } from "@react-symbols/icons/utils";

import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "../hooks/use-editor";
import { XIcon } from "lucide-react";

export const Tab = ({
  fileId,
  isFirst,
  projectId,
}: {
  fileId: Id<"files">;
  isFirst: boolean;
  projectId: Id<"projects">;
}) => {
  const file = useFile(fileId);
  const { activeTabId, previewTabId, setActiveTab, openFile, closeTab } =
    useEditor(projectId);

  const isActive = activeTabId === fileId;
  const isPreview = previewTabId === fileId;
  const fileName = file?.name ?? "Loading...";

  return (
    <div
      onClick={() => setActiveTab(fileId)}
      onDoubleClick={() => openFile(fileId, { pinned: true })}
      className={cn(
        "text-muted-foreground group flex h-8.75 cursor-pointer items-center gap-2 border-x border-y border-transparent pr-1.5 pl-2",
        !isActive && "hover:bg-accent/30",
        isActive &&
          "bg-background text-foreground border-x-border border-b-background -mb-px drop-shadow",
        isFirst && "border-l-transparent!",
      )}
    >
      {file === undefined ? (
        <Spinner className="text-ring" />
      ) : (
        <FileIcon fileName={fileName} autoAssign className="size-4" />
      )}
      <span className={cn("text-sm whitespace-nowrap", isPreview && "italic")}>
        {fileName}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeTab(fileId);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            closeTab(fileId);
          }
        }}
        className={cn(
          "rounded-sm p-0.5 opacity-0 group-hover:opacity-100 hover:bg-white/10",
          isActive && "opacity-100",
        )}
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  );
};
