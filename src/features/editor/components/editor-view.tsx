import { useFile } from "@/features/projects/hooks/use-files";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "../hooks/use-editor";
import { FileBreadcrumbs } from "./file-breadcrumbs";
import { TopNavigation } from "./top-navigation";
import Image from "next/image";

export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { activeTabId } = useEditor(projectId);
  const activeFile = useFile(activeTabId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>
      {activeTabId && <FileBreadcrumbs projectId={projectId} />}
      <div className="bg-background min-h-0 flex-1">
        {!activeFile && (
          <div className="flex size-full items-center justify-center">
            <Image src="/logo.png" alt="Zenith" width={50} height={50} className="opacity-25 " />
          </div>
        )}
      </div>
    </div>
  );
};
