import TeamGrid from "@/frontend/components/teams/team-grid";
import { api } from "@/trpc/server";

export default async function Teams() {
  const data = await api.teams.getTeams();
  return <TeamGrid data={data} />;
}
