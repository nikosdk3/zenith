import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimestamp = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp - 100), {
    addSuffix: true,
  });
};
