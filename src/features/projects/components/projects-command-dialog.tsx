import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useProjects, useRemoveProject } from "../hooks/use-projects";
import { getProjectIcon } from "../utils/get-project-icon";
import { Id } from "../../../../convex/_generated/dataModel";
import { Trash2Icon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectsCommandDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const projects = useProjects();
  const removeProject = useRemoveProject();

  const handleSelect = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    onOpenChange(false);
  };

  const handleRemoveProject = (projectId: Id<"projects">) => {
    return removeProject({ id: projectId });
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Projects"
      description="Search and navigate to your projects"
    >
      <CommandInput placeholder="Search projects..." />
      <CommandList>
        <CommandEmpty>No projects found.</CommandEmpty>
        <CommandGroup heading="Projects">
          {projects?.map((project) => (
            <CommandItem
              key={project._id}
              value={`${project.name}-${project._id}`}
              onSelect={() => handleSelect(project._id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {getProjectIcon(project, 4)}
                <span>{project.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveProject(project._id);
                }}
              >
                <Trash2Icon className="size-6"/>
              </button>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
