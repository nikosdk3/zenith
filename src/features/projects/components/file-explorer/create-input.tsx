import { useState } from "react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { ChevronRightIcon } from "lucide-react";
import { getItemPadding } from "./constants";

export const CreateInput = ({
  type,
  level,
  onSubmit,
  onCancel,
}: {
  type: "file" | "folder";
  level: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      onSubmit(trimmedValue);
    } else {
      onCancel();
    }
  };

  return (
    <div
      className="bg-accent/30 flex h-5.5 w-full items-center p-0.5"
      style={{ paddingLeft: getItemPadding(level) }}
    >
      <div className="flex items-center gap-0.5 p-0.5">
        {type === "folder" && (
          <>
            <ChevronRightIcon className="text-muted-foreground size-4 shrink-0" />
            <FolderIcon folderName={value} className="size-4" />
          </>
        )}
        {type === "file" && (
          <FileIcon fileName={value} autoAssign className="size-4" />
        )}
      </div>
      <input
        type="text"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="focus:ring-ring flex-1 bg-transparent text-sm outline-none focus:ring-1 focus:ring-inset"
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }}
      />
    </div>
  );
};
