import { cn } from "@/lib/utils";

export function Button({ children, className, ...props }) {
  return ( 
    <div 
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-orange-300 h-10 px-4 py-2",
      className
    )}
    {...props}
  >
    {children}
  </div>
  )
}