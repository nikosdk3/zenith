/* eslint-disable react-hooks/purity */

import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useProject = (projectId: Id<"projects">) => {
  return useQuery(api.projects.getById, { id: projectId });
};

export const useProjects = () => {
  return useQuery(api.projects.get);
};

export const useProjectsPartial = (limit: number) => {
  return useQuery(api.projects.getPartial, {
    limit,
  });
};

export const useCreateProject = () => {
  return useMutation(api.projects.create).withOptimisticUpdate(
    (localStore, args) => {
      const existingProjects = localStore.getQuery(api.projects.get);

      if (existingProjects !== undefined) {
        const newProject = {
          _id: crypto.randomUUID() as Id<"projects">,
          _creationTime: Date.now(),
          name: args.name,
          ownerId: "anonymous",
          updatedAt: Date.now(),
        };

        localStore.setQuery(api.projects.get, {}, [
          newProject,
          ...existingProjects,
        ]);
      }
    },
  );
};

export const useRenameProject = (projectId: Id<"projects">) => {
  return useMutation(api.projects.rename).withOptimisticUpdate(
    (localStore, args) => {
      const project = localStore.getQuery(api.projects.getById, {
        id: projectId,
      });

      if (project !== undefined && project !== null) {
        localStore.setQuery(
          api.projects.getById,
          { id: projectId },
          { ...project, name: args.name, updatedAt: Date.now() },
        );
      }

      const projects = localStore.getQuery(api.projects.get);

      if (projects !== undefined) {
        const updatedProjects = projects.map((project) => {
          return project._id === args.id
            ? {
                ...project,
                name: args.name,
                updatedAt: Date.now(),
              }
            : project;
        });

        localStore.setQuery(api.projects.get, {}, updatedProjects);
      }
    },
  );
};
