import { cn } from "@/lib/utils";

export const Tab = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "text-muted-foreground hover:bg-accent/30 flex h-full cursor-pointer items-center gap-2 border-r px-3",
        isActive && "bg-background text-foreground",
      )}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
};
