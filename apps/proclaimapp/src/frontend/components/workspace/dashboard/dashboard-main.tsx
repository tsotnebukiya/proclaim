"use client";

import { RouterOutput } from "@/server/api/root";
import GlobalEvents from "./global-actions";
import { api } from "@/trpc/react";

export default function DashboardComponent({
  data,
  workspace,
}: {
  data: RouterOutput["workspace"]["dashboard"]["getData"];
  workspace: string;
}) {
  const { data: fetchedData } = api.workspace.dashboard.getData.useQuery(
    { workspace },
    {
      initialData: data,
    },
  );
  return (
    <div className="grid h-full grid-cols-5 gap-12">
      <div className="col-span-5">
        <GlobalEvents data={fetchedData.events} workspace={workspace} />
      </div>
    </div>
  );
}
