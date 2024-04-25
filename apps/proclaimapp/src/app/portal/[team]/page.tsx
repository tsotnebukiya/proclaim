export default function TeamDashboard({
  params,
}: {
  params: { team: string };
}) {
  return <div>{params.team}</div>;
}
