import Link from "next/link";
import { Pyramid } from "lucide-react";
import Slash from "../components/icons/slash";
import TeamSwitcher from "./team-switcher";
import Search from "./search";
import UserNav from "./user-nav";
import NavMenu from "./nav";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="bg-background sticky top-0 flex flex-col gap-4 border-b px-6 pt-4">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <Link href={"/"}>
              <Pyramid size={36} />
            </Link>
            <Slash />
            <TeamSwitcher />
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
        <div>
          <NavMenu />
        </div>
      </header>
      <main className="bg-muted/40 flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        {children}
      </main>
    </div>
  );
}
