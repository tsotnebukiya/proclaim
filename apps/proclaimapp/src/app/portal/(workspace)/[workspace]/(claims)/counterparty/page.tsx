import { api } from "@/trpc/server";

export default async function CounterpartyClaims({
  params,
}: {
  params: { workspace: string };
}) {
  const { workspace } = params;
  const cpClaims = await api.workspace.cpClaims.getCPClaims({ workspace });

  console.log(cpClaims);
  return <div></div>;
}
