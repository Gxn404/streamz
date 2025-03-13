import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn("flex h-10 w-full rounded-md border-2 border-yellow-500 bg-transparent px-3 py-2 text-white text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
      {...props}
    />
  );
}