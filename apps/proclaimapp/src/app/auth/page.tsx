import { Auth } from "@/frontend/components/auth/auth";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const session = await getServerAuthSession();
  if (session) {
    redirect("portal");
  }
  return <Auth />;
}
