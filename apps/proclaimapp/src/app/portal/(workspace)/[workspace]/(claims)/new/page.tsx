import NewClaims from "@/frontend/components/workspace/new/new-claim";

export default function New({ params }: { params: { workspace: string } }) {
  const { workspace } = params;
  return <NewClaims workspace={workspace} />;
}
