import ky, { HTTPError } from "ky";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProject } from "../hooks/use-projects";

import { Id } from "../../../../convex/_generated/dataModel";
import { CheckCheckIcon, LoaderIcon, XCircleIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const formSchema = z.object({
  repoName: z
    .string()
    .min(1, "Repository name is required")
    .max(100, "Repository name is too long")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Only alphanumeric characters, hyphens, underscores, and dots are allowed",
    ),
  visibility: z.enum(["public", "private"]),
  description: z.string().max(350, "Description is too long"),
});

interface ExportPopoverProps {
  projectId: Id<"projects">;
}

export const ExportPopover = ({ projectId }: ExportPopoverProps) => {
  const project = useProject(projectId);
  const [open, setOpen] = useState(false);
  const { openUserProfile } = useClerk();

  const exportStatus = project?.exportStatus;
  const exportRepoUrl = project?.exportRepoUrl;

  const form = useForm({
    defaultValues: {
      repoName: project?.name?.replace(/[^a-zA-Z0-9._-]/g, "-") ?? "",
      visibility: "private" as "public" | "private",
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await ky.post("/api/github/export", {
          json: {
            projectId,
            repoName: value.repoName,
            visibility: value.repoName,
            description: value.description || undefined,
          },
        });

        toast.success("Export started...");
      } catch (error) {
        if (error instanceof HTTPError) {
          const body = await error.response.json<{ error: string }>();
          if (body?.error?.includes("GitHub not connected")) {
            toast.error("GitHub account not connected", {
              action: {
                label: "Connect",
                onClick: () => openUserProfile(),
              },
            });
            setOpen(false);
            return;
          }
        }

        toast.error("Unable to export repository.");
      }
    },
  });

  const handleCancelExport = async () => {
    await ky.post("/api/github/export/cancel", {
      json: { projectId },
    });
    setOpen(false);
  };

  const getStatusIcon = () => {
    if (exportStatus === "exporting") {
      return <LoaderIcon className="size-3.5 animate-spin" />;
    }
    if (exportStatus === "completed") {
      return <CheckCheckIcon className="size-3.5 text-emerald-500" />;
    }
    if (exportStatus === "failed") {
      return <XCircleIcon className="size-3.5 text-red-500" />;
    }
    return <FaGithub className="size-3.5" />;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="text-muted-foreground hover:bg-accent/30 flex h-full cursor-pointer items-center gap-1.5 border-l px-3">
          {getStatusIcon()}
          <span className="text-sm">Export</span>
        </div>
      </PopoverTrigger>
    </Popover>
  );
};
