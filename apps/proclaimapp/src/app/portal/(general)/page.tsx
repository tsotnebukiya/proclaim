import OverviewMain from "@/frontend/components/overview/overview-main";
import SkeletonBlocks from "@/frontend/components/skeleton";
import { api } from "@/trpc/server";

export default async function Portal() {
  const data = await api.overview.getData();
  return <OverviewMain data={data}/>;
}
