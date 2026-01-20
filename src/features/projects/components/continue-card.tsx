import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

import { Doc } from "../../../../convex/_generated/dataModel";
import { getProjectIcon } from "../utils/get-project-icon";

export const ContinueCard = ({ project }: { project: Doc<"projects"> }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs">Last updated</span>
      <Button
        variant="outline"
        asChild
        className="flex h-auto flex-col items-start gap-2 rounded-none p-4"
      >
        <Link href={`/projects/${project._id}`} className="group">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {getProjectIcon(project, 3.5)}
              <span className="truncate font-medium">{project.name}</span>
            </div>
            <ArrowRightIcon className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
          <span className="text-muted-foreground text-xs">
            {formatTimestamp(project.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  );
};
