import { useState } from "react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { ChevronRightIcon } from "lucide-react";
import { getItemPadding } from "./constants";
import { cn } from "@/lib/utils";

export const RenameInput = ({
  type,
  defaultValue,
  isOpen,
  level,
  onSubmit,
  onCancel,
}: {
  type: "file" | "folder";
  defaultValue: string;
  isOpen?: boolean;
  level: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = () => {
    const trimmedValue = value.trim() || defaultValue;
    onSubmit(trimmedValue);
  };

  return (
    <div
      className="bg-accent/30 flex h-5.5 w-full items-center"
      style={{ paddingLeft: getItemPadding(level, type === "file") }}
    >
      <div className="flex items-center gap-0.5">
        {type === "folder" && (
          <>
            <ChevronRightIcon
              className={cn(
                "text-muted-foreground size-4 shrink-0",
                isOpen && "rotate-90 transition-transform",
              )}
            />
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
        className="focus:ring-ring ml-0.5 flex-1 bg-transparent text-sm outline-none focus:ring-1 focus:ring-inset"
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }}
        onFocus={(e) => {
          if (type === "folder") {
            e.currentTarget.select();
          } else {
            const value = e.currentTarget.value;
            const lastDotIndex = value.lastIndexOf(".");
            if (lastDotIndex > 0) {
              e.currentTarget.setSelectionRange(0, lastDotIndex);
            } else {
              e.currentTarget.select();
            }
          }
        }}
      />
    </div>
  );
};
