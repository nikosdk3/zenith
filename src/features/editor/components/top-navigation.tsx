import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "../hooks/use-editor";
import { Tab } from "./tab";

export const TopNavigation = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { openTabs } = useEditor(projectId);

  return (
    <ScrollArea className="flex-1">
      <nav className="bg-sidebar flex h-8.75 items-center border-b">
        {openTabs.map((fileId, index) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isFirst={index === 0}
            projectId={projectId}
          />
        ))}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
