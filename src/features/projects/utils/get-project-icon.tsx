import { FaGithub } from "react-icons/fa";

import { Doc } from "../../../../convex/_generated/dataModel";
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react";

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
        <Loader2Icon
          className={`text-muted-foreground size-${size} animate-spin`}
        />
      );
    default:
      return <GlobeIcon className={`text-muted-foreground size-${size}`} />;
  }
};
