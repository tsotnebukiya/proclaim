import PortalLayout from "@/frontend/layout/layout";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
