import Link from "next/link";
import { formatTimestamp } from "@/lib/utils";
import { Doc } from "../../../../convex/_generated/dataModel";
import { getProjectIcon } from "../utils/get-project-icon";

export const ProjectItem = ({ project }: { project: Doc<"projects"> }) => {
  return (
    <Link
      href={`/projects/${project._id}`}
      className="text-muted-foreground group flex w-full items-center justify-between py-1 text-sm font-medium"
    >
      <div className="group-hover:text-foreground flex items-center gap-2 transition-colors">
        {getProjectIcon(project, 3.5)}
        <span className="truncate">{project.name}</span>
      </div>
      <span>{formatTimestamp(project.updatedAt)}</span>
    </Link>
  );
};
