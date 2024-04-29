"use client";
import {
  Divider,
  List,
  ListItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

import { Dialog, DialogTrigger } from "@/frontend/components/ui/dialog";

import {
  RiLayoutGridLine,
  RiListUnordered,
  RiStackLine,
} from "@remixicon/react";
import { Card } from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { RouterOutput } from "@/server/api/root";
import { cn, shortenAddress } from "@/frontend/lib/utils";
import { Switch } from "../ui/switch";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import NewTeamModal from "./new-team";
import { useState } from "react";

type TeamsData = RouterOutput["teams"]["getTeams"];
export default function TeamGrid({ data: initialData }: { data: TeamsData }) {
  const [open, setOpen] = useState(false);
  const { data, refetch } = api.teams.getTeams.useQuery(undefined, {
    initialData: initialData,
  });
  const { mutate, isPending } = api.teams.switchSTP.useMutation({
    onSuccess: async (data) => {
      await refetch();
      toast.success(`STP turned ${data ? "on" : "off"}`);
    },
  });

  return (
    <>
      <TabGroup>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-tremor-title font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong ">
              Teams
            </h3>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-tremor-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
              {data.length}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <TabList
              variant="solid"
              className="-mx-1 bg-transparent dark:bg-transparent"
            >
              <Tab
                icon={RiLayoutGridLine}
                className="flex h-8 items-center text-tremor-content-emphasis"
              />
              <Tab
                icon={RiListUnordered}
                className="flex h-8 items-center text-tremor-content-emphasis"
              />
            </TabList>
            <div className="hidden h-8 w-px bg-tremor-border dark:bg-dark-tremor-border sm:block" />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default"> Add Team</Button>
              </DialogTrigger>
              {open && (
                <NewTeamModal setOpen={setOpen} onSuccess={() => refetch()} />
              )}
            </Dialog>
          </div>
        </div>
        <Divider className="my-4" />
        <TabPanels>
          <TabPanel>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((team) => {
                const { pending, stp, total, volume } = team.details;
                const value = new Intl.NumberFormat("en-US", {
                  currency: "USD",
                  style: "currency",
                  maximumFractionDigits: 0,
                }).format(volume);
                return (
                  <Card
                    key={team.name}
                    className="relative overflow-hidden p-0"
                  >
                    <div className="border-b border-border bg-muted/50 p-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background">
                      <div className="flex items-center space-x-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-tremor-small border border-border bg-tremor-background dark:border-dark-tremor-border dark:bg-dark-tremor-background">
                          <RiStackLine
                            className="h-5 w-5 text-tremor-content dark:text-dark-tremor-content"
                            aria-hidden={true}
                          />
                        </span>
                        <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          <div className="">
                            {/* Extend link to entire card */}
                            <span />
                            {team.name}
                          </div>
                        </h3>
                      </div>
                    </div>
                    <div className="px-6 py-4">
                      <List>
                        <ListItem className="py-2.5">
                          <span>Name</span>

                          <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {team.name}
                          </span>
                        </ListItem>
                        <ListItem className="py-2.5">
                          <span>Settled</span>

                          <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {total}
                          </span>
                        </ListItem>
                        <ListItem className="py-2.5">
                          <span>Pending</span>

                          <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {pending}
                          </span>
                        </ListItem>
                        <ListItem className="py-2.5">
                          <span>Volume</span>

                          <span className="flex items-center gap-1 font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {value}
                          </span>
                        </ListItem>
                        <ListItem className="py-2.5">
                          <span>Contract Address</span>

                          <Link
                            href={`https://sn2-stavanger-blockscout.eu-north-2.gateway.fm/address/${team.details.contractAddress}`}
                            target="_blank"
                            className={cn(
                              buttonVariants({
                                variant: "link",
                              }),
                              "h-fit p-0",
                            )}
                          >
                            {shortenAddress(team.details.contractAddress)}
                          </Link>
                        </ListItem>
                        <ListItem className="py-2.5">
                          <span>STP</span>

                          <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {stp ? (
                              <span className="inline-flex items-center rounded-tremor-small bg-emerald-100 px-2 py-0.5 text-tremor-label font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20">
                                Live
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-tremor-small bg-muted/50 px-2 py-0.5 text-tremor-label font-medium text-tremor-content-emphasis ring-1 ring-inset ring-tremor-ring dark:bg-dark-tremor-background-muted dark:text-tremor-content-subtle dark:ring-dark-tremor-ring">
                                Inactive
                              </span>
                            )}
                          </span>
                        </ListItem>
                      </List>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabPanel>
          <TabPanel>
            <Table>
              <TableHead>
                <TableRow className="border-b border-border dark:border-dark-tremor-border">
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Name
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Settled
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Pending
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Volume USD
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Contract Address
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    STP
                  </TableHeaderCell>
                  <TableHeaderCell className="text-end">
                    Switch STP
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((team) => {
                  return (
                    <TableRow
                      key={team.name}
                      className="hover:bg-muted/50 hover:dark:bg-dark-tremor-background-muted"
                    >
                      <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {team.name}
                      </TableCell>
                      <TableCell>{team.details.total}</TableCell>
                      <TableCell>{team.details.pending}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US", {
                          currency: "USD",
                          style: "currency",
                          maximumFractionDigits: 0,
                        }).format(team.details.volume)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`https://sn2-stavanger-blockscout.eu-north-2.gateway.fm/address/${team.details.contractAddress}`}
                          target="_blank"
                          className={cn(
                            buttonVariants({
                              variant: "link",
                            }),
                            "h-fit p-0",
                          )}
                        >
                          {shortenAddress(team.details.contractAddress)}
                        </Link>
                      </TableCell>
                      <TableCell className="!w-24">
                        {team.details.stp ? (
                          <span className="inline-flex items-center rounded-tremor-small bg-emerald-100 px-2 py-0.5 text-tremor-label font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20">
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-tremor-small bg-muted/50 px-2 py-0.5 text-tremor-label font-medium text-tremor-content-emphasis ring-1 ring-inset ring-tremor-ring dark:bg-dark-tremor-background-muted dark:text-tremor-content-subtle dark:ring-dark-tremor-ring">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={team.details.stp}
                          disabled={isPending}
                          onCheckedChange={() =>
                            mutate({ id: team.details.id })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
