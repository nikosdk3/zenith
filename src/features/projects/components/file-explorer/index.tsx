import { useState } from "react";
import {
  ChevronRightIcon,
  CopyMinusIcon,
  FilePlusCornerIcon,
  FolderPlusIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Id } from "../../../../../convex/_generated/dataModel";
import { useProject } from "../../hooks/use-projects";
import { CreateInput } from "./create-input";
import {
  useCreateFile,
  useCreateFolder,
  useFolderContents,
} from "../../hooks/use-files";
import { LoadingRow } from "./loading-row";
import { cp } from "fs";
import { Tree } from "./tree";

export const FileExplorer = ({ projectId }: { projectId: Id<"projects"> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collapseKey, setCollapseKey] = useState(0);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const project = useProject(projectId);
  const rootFiles = useFolderContents({
    projectId,
    enabled: isOpen,
  });

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();
  const handleCreate = (name: string) => {
    setCreating(null);

    if (creating === "file") {
      createFile({
        projectId,
        name,
        content: "",
        parentId: undefined,
      });
    } else {
      createFolder({
        projectId,
        name,
        parentId: undefined,
      });
    }
  };

  return (
    <div className="bg-sidebar h-full min-w-0">
      <ScrollArea>
        <div
          role="button"
          onClick={() => setIsOpen((value) => !value)}
          className="group/project bg-accent flex h-5.5 cursor-pointer items-center gap-0.5 text-left font-bold"
        >
          <ChevronRightIcon
            className={cn(
              "text-muted-foreground size-4 shrink-0",
              isOpen && "rotate-90 transition-transform",
            )}
          />
          <p className="line-clamp-1 text-xs uppercase">
            {project?.name ?? "Loading..."}
          </p>
          <div className="ml-auto flex items-center gap-0.5 opacity-0 transition-none duration-0 group-hover/project:opacity-100">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating("file");
              }}
              variant="highlight"
              size="icon-xs"
            >
              <FilePlusCornerIcon className="size-3.5" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating("folder");
              }}
              variant="highlight"
              size="icon-xs"
            >
              <FolderPlusIcon className="size-3.5" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCollapseKey((prev) => prev + 1);
              }}
              variant="highlight"
              size="icon-xs"
            >
              <CopyMinusIcon className="size-3.5" />
            </Button>
          </div>
        </div>
        {isOpen && (
          <>
            {rootFiles === undefined && <LoadingRow level={0} />}
            {creating && (
              <CreateInput
                type={creating}
                level={0}
                onSubmit={handleCreate}
                onCancel={() => setCreating(null)}
              />
            )}
            {rootFiles?.map((item) => (
              <Tree
                key={`${item._id}-${collapseKey}`}
                item={item}
                level={0}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
};
