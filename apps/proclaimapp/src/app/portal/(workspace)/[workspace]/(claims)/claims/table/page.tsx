import { ClaimsTable } from "@/frontend/components/workspace/claims/claims-table";
import { columns } from "@/frontend/components/workspace/claims/columns";
import { api } from "@/trpc/server";

export default async function Settled({
  params,
}: {
  params: { workspace: string };
}) {
  const { workspace } = params;
  const claims = await api.workspace.claims.getClaims({ workspace });
  const cpValues = claims.map((claim) => claim.cp);
  const uniqueCpValues = [...new Set(cpValues)];
  const CPs = uniqueCpValues.map((el) => ({ value: el, label: el }));
  return <ClaimsTable columns={columns} data={claims} uniqueCpValues={CPs} />;
}
