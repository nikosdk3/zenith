import { Spinner } from "@/components/ui/spinner";

export const AuthLoadingView = () => {
  return (
    <div className="bg-background flex h-screen items-center justify-center">
      <Spinner className="size-6 text-ring"/>
    </div>
  );
};
