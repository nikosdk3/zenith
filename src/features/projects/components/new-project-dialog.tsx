"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import ky from "ky";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateProject } from "../hooks/use-projects";

import { Id } from "../../../../convex/_generated/dataModel";
import { Textarea } from "@/components/ui/textarea";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  projectName: z.string().min(1),
  message: z.string(),
});

export const NewProjectDialog = ({
  open,
  onOpenChange,
}: NewProjectDialogProps) => {
  const router = useRouter();
  const createProject = useCreateProject();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      projectName: "",
      message: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      try {
        let projectId;
        const message = value.message.trim();
        if (!message) {
          projectId = await createProject({ name: value.projectName });
        } else {
          const response = await ky
            .post("/api/projects/create-with-prompt", {
              json: {
                projectName: value.projectName,
                prompt: message,
              },
            })
            .json<{ projectId: Id<"projects"> }>();
          projectId = response.projectId;
        }

        toast.success("Project created");
        onOpenChange(false);
        router.push(`/projects/${projectId}`);
      } catch {
        toast.error("Unable to create project");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="p-3 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>What do you want to build?</DialogTitle>
          <DialogDescription>
            Describe your project and AI will help you create it.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4">
            <form.Field name="projectName">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Name of your project"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="message">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ask Zenith to build..."
                      rows={2}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  size="sm"
                  className="w-full"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? " Creating..." : "Create Project"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
