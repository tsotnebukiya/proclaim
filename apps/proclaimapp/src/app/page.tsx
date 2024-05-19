import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { env } from "@/env";
import HomePageComp from "@/frontend/components/homepage/homepage-comp";

export default async function Home() {
  return <HomePageComp />;
}
