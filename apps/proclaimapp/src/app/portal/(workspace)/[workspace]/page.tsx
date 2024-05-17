import DashboardComponent from "@/frontend/components/workspace/dashboard/dashboard-main";
import { api } from "@/trpc/server";

export default async function TeamDashboard({
  params,
}: {
  params: { workspace: string };
}) {
  const { workspace } = params;
  const data = await api.workspace.dashboard.getData({ workspace });
  return <DashboardComponent data={data} workspace={workspace} />;
}
