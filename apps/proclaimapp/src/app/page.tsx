import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { env } from "@/env";

export default async function Home() {
  return <div>Ooops... It's empty</div>;
}
