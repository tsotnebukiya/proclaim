"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/frontend/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/frontend/components/ui/avatar";
import { Button, buttonVariants } from "@/frontend/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/frontend/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/frontend/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import NewTeamModal from "../components/teams/new-team";

const groups = [
  {
    label: "Teams",
    teams: [
      {
        label: "ICSD Lending",
        value: "icsd-le",
      },
      {
        label: "US Lending",
        value: "us-le",
      },
    ],
  },
];

type Team = (typeof groups)[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({}: TeamSwitcherProps) {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const teamPath = `/${parts[1]}/${parts[2]}`;
  const { push } = useRouter();
  const selectedTeam =
    groups[0]?.teams.find((el) => `/portal/${el.value}` === teamPath) || null;
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn(
              "w-[200px] justify-between",
              !selectedTeam
                ? "text-muted-foreground"
                : buttonVariants({ variant: "secondary" }),
            )}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTeam?.value}.png`}
                alt={selectedTeam?.label}
                className="grayscale"
              />
            </Avatar>
            {selectedTeam?.label || "Choose Team"}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        push(`/portal/${team.value}`);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                      </Avatar>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam?.value === team.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {showNewTeamDialog && <NewTeamModal setOpen={setShowNewTeamDialog} />}
    </Dialog>
  );
}
