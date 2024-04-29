export default function TeamDashboard({
  params,
}: {
  params: { team: string };
}) {
  return <>{params.team}</>;
}
