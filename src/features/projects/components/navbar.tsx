import Link from "next/link";
import Image from "next/image";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Id } from "../../../../convex/_generated/dataModel";
import { font } from "../utils/font";
import { useGetProjects, useRenameProject } from "../hooks/use-projects";
import { formatDistanceToNow } from "date-fns";

export const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
  const project = useGetProjects(projectId);
  const renameProject = useRenameProject(projectId);

  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(project?.name ?? "");

  const handleStartRename = () => {
    if (!project) return;

    setName(name);
    setIsRenaming(true);
  };

  const handleSubmit = () => {
    if (!project) return;

    const trimmedName = name.trim();
    if (trimmedName && trimmedName !== project.name) {
      renameProject({ id: projectId, name: trimmedName });
    }

    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setName(project?.name ?? "");
      setIsRenaming(false);
    }
  };

  return (
    <nav className="bg-sidebar flex items-center justify-between gap-x-2 border-b p-2">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="group/logo flex items-center gap-1.5"
                asChild
              >
                <Button variant="ghost" className="h-7! w-fit! p-1.5!" asChild>
                  <Link href="/">
                    <Image src="/logo.png" alt="logo" width={20} height={20} />
                    <span className={cn("text-sm font-medium", font.className)}>
                      Zenith
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="mr-1! ml-0!" />
            <BreadcrumbItem>
              {isRenaming ? (
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className="text-foreground focus:ring-ring max-w-60 cursor-pointer truncate bg-transparent text-sm font-medium outline-none focus:ring-1 focus:ring-inset"
                />
              ) : (
                <BreadcrumbPage
                  onClick={handleStartRename}
                  className="hover:text-primary max-w-60 cursor-pointer truncate text-sm font-medium"
                >
                  {project?.name ?? "Loading..."}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {project?.importStatus === "importing" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <LoaderIcon className="text-muted-foreground size-4 animate-spin" />
            </TooltipTrigger>
            <TooltipContent>Importing...</TooltipContent>
          </Tooltip>
        ) : (
          project?.updatedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CloudCheckIcon className="text-muted-foreground size-4" />
              </TooltipTrigger>
              <TooltipContent>
                Saved{" "}
                {formatDistanceToNow(project.updatedAt, {
                  addSuffix: true,
                })}
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
      <div className="flex items-center gap-2">
        <UserButton />
      </div>
    </nav>
  );
};
