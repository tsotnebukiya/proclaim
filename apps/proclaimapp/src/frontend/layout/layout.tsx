import Link from "next/link";
import { Pyramid } from "lucide-react";
import TeamSwitcher from "./team-switcher";
import Search from "./search";
import UserNav from "./user-nav";
import NavMenu from "./nav";
import { Session } from "next-auth";

export default function PortalLayout({
  children,
  session
}: {
  children: React.ReactNode;
  session:Session
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4  px-4 pt-4">
          <div className="flex items-center">
            <div className="flex items-center gap-6">
              <Link href={"/"}>
                <Pyramid size={36} />
              </Link>
              <TeamSwitcher />
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav session={session}/>
            </div>
          </div>
          <div>
            <NavMenu />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col bg-background py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
