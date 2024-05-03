import { cn } from "@/frontend/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-tremor-background-emphasis/20",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
