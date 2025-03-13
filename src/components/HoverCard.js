import { cn } from "@/lib/utils";

export function HoverCard({ children, content, className, ...props }) {
  return (
    <div className="relative" {...props}>
      {children}
      <div
        className={cn(
          "rounded-lg bg-gray-800 p-4 shadow-md hidden hover:block absolute z-10",
          className
        )}
      >
        <p className="text-white">{content}</p>
      </div>
    </div>
  );
}