import { columns } from "@/frontend/components/workspace/cp-claims/columns";
import { CPClaimsTable } from "@/frontend/components/workspace/cp-claims/cp-claims-table";
import { api } from "@/trpc/server";

export default async function CounterpartyClaims({
  params,
}: {
  params: { workspace: string };
}) {
  const { workspace } = params;
  const cpClaims = await api.workspace.cpClaims.getCPClaims({ workspace });
  const cpValues = cpClaims.map((claim) => claim.cp);
  const uniqueCpValues = [...new Set(cpValues)];
  const CPs = uniqueCpValues.map((el) => ({ value: el, label: el }));
  return (
    <CPClaimsTable
      data={cpClaims}
      columns={columns}
      uniqueCpValues={CPs}
      workspace={workspace}
    />
  );
}
