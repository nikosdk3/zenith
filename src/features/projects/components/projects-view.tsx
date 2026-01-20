"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { SparkleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";

import { font } from "../utils/font";
import { ProjectsList } from "./projects-list";
import { useCreateProject } from "../hooks/use-projects";
import { ProjectsCommandDialog } from "./projects-command-dialog";

export const ProjectsView = () => {
  const createProject = useCreateProject();

  const [commandDialogOpen, setCommandDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <ProjectsCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <div className="bg-sidebar flex min-h-screen flex-col items-center justify-center p-6 md:p-16">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="group/logo flex w-full items-center gap-2">
              <Image
                src="/logo.png"
                alt="Zenith"
                width={32}
                height={32}
                className="size-8 md:size-11.5"
              />
              <h1
                className={cn(
                  "text-4xl font-semibold text-white md:text-5xl",
                  font.className,
                )}
              >
                Zenith
              </h1>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const projectName = uniqueNamesGenerator({
                    dictionaries: [adjectives, animals, colors],
                    separator: "-",
                    length: 3,
                  });

                  createProject({
                    name: projectName,
                  });
                }}
                className="bg-background flex h-full flex-col items-start justify-start gap-6 rounded-none border p-4"
              >
                <div className="flex w-full items-center justify-between">
                  <SparkleIcon className="size-4" />
                  <Kbd className="bg-accent border">⌘J</Kbd>
                </div>
                <div className="text-sm">New</div>
              </Button>
              <Button
                variant="outline"
                onClick={() => {}}
                className="bg-background flex h-full flex-col items-start justify-start gap-6 rounded-none border p-4"
              >
                <div className="flex w-full items-center justify-between">
                  <FaGithub className="size-4" />
                  <Kbd className="bg-accent border">⌘I</Kbd>
                </div>
                <div className="text-sm">Import</div>
              </Button>
            </div>

            <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
          </div>
        </div>
      </div>
    </>
  );
};
