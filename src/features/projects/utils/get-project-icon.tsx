import { FaGithub } from "react-icons/fa";

import { AlertCircleIcon, GlobeIcon, LoaderIcon } from "lucide-react";

import { Doc } from "../../../../convex/_generated/dataModel";

export const getProjectIcon = (data: Doc<"projects">, size: number) => {
  switch (data.importStatus) {
    case "completed":
      return <FaGithub className={`text-muted-foreground size-${size}`} />;
    case "failed":
      return (
        <AlertCircleIcon className={`text-muted-foreground size-${size}`} />
      );
    case "importing":
      return (
        <LoaderIcon
          className={`text-muted-foreground size-${size} animate-spin`}
        />
      );
    default:
      return <GlobeIcon className={`text-muted-foreground size-${size}`} />;
  }
};
