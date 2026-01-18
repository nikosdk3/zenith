import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";

import { useProjectsPartial } from "../hooks/use-projects";
import { ProjectItem } from "./project-item";
import { ContinueCard } from "./continue-card";

interface Props {
  onViewAll: () => void;
}

export const ProjectsList = ({ onViewAll }: Props) => {
  const projects = useProjectsPartial(6);

  if (projects === undefined) {
    return <Spinner className="text-ring size-4" />;
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-4">
      {mostRecent ? <ContinueCard project={mostRecent} /> : null}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs">
              Recent Projects
            </span>
            <button
              onClick={onViewAll}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
            >
              <span>View all</span>
              <Kbd className="bg-accent border">⌘K</Kbd>
            </button>
          </div>
          <ul className="flex flex-col">
            {rest.map((project) => (
              <ProjectItem key={project._id} project={project} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
