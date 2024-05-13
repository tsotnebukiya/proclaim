import PortalLayout from "@/frontend/layout/layout";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Portal({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/auth");
  }
  return <PortalLayout session={session}>{children}</PortalLayout>;
}
