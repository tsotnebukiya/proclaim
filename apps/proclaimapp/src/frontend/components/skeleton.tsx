import { Divider } from "@tremor/react";
import { Card } from "./ui/card";
import { Skeleton } from "@/frontend/components/ui/skeleton";

function SkeletonCard() {
  return (
    <Card className="flex w-full flex-col gap-4 p-4">
      <Skeleton className="h-[10px] w-full" />
      <Skeleton className="h-[10px] w-[90%]" />
      <Skeleton className="h-[10px] w-[80%]" />
      <Skeleton className="h-[10px] w-[90%]" />
      <Skeleton className="h-[10px] w-[70%]" />
      <Skeleton className="h-[10px] w-full" />
      <Skeleton className="h-[10px] w-[90%]" />
      <Skeleton className="h-[10px] w-[80%]" />
      <Skeleton className="h-[10px] w-[90%]" />
      <Skeleton className="h-[10px] w-[70%]" />
    </Card>
  );
}

export default function SkeletonBlocks() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="flex flex-col gap-2 text-tremor-title font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong ">
            <Skeleton className="h-[10px] w-32" />
            <Skeleton className="h-[10px] w-28" />
          </h3>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-[28px] w-44" />
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid grid-cols-2 gap-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </>
  );
}
