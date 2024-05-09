import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/frontend/lib/utils";
import { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import {
  LayoutDashboard,
  LucideIcon,
  CircleDashed,
  CalendarFold,
  BookCheck,
  Plus,
} from "lucide-react";

type NavItem = {
  label: string;
  title: string;
  href: string;
  Icon: LucideIcon;
  disabled?: boolean;
  count?: number;
};

interface DashboardNavProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isCollapsed?: boolean;
}

const items: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    Icon: LayoutDashboard,
    label: "dashboard",
  },
  {
    title: "Claims",
    href: "/claims/table",
    Icon: BookCheck,
    label: "settled",
  },
  {
    title: "Pending CP",
    href: "/counterparty",
    Icon: CircleDashed,
    label: "pending",
  },
  {
    title: "Create new",
    href: "/new",
    Icon: Plus,
    label: "new",
  },
];

export function DashboardNav({ setOpen, isCollapsed }: DashboardNavProps) {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const teamPath = `/${parts[1]}/${parts[2]}`;
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const href = teamPath + item.href;
        const isHome = pathname === teamPath && item.href === "/";
        const isActive = item.href !== "/" && pathname.includes(item.href);

        const link = (
          <Link key={index} href={href} onClick={() => setOpen?.(false)}>
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10",
                isHome || isActive
                  ? "justify-start rounded-md bg-primary text-secondary hover:bg-primary"
                  : "transparent",
                item.disabled && "cursor-not-allowed opacity-80",
              )}
            >
              <item.Icon className="icon-element h-6 w-5" />
              {isCollapsed ? null : (
                <span className="text-element ml-2 h-5">{item.title}</span>
              )}
              {isCollapsed
                ? null
                : item.count && (
                    <span className="text-element ml-auto text-xs font-semibold">
                      {item.count}
                    </span>
                  )}
            </span>
          </Link>
        );

        return (
          item.href &&
          (isCollapsed ? (
            <Tooltip key={index}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
          ) : (
            link
          ))
        );
      })}
    </nav>
  );
}
