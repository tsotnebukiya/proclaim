import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { statuses } from "../shared-table/data";
import { cn, shortenAddress } from "@/frontend/lib/utils";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { RouterOutput } from "@/server/api/root";
import Link from "next/link";
import { Button, buttonVariants } from "../../ui/button";
import { toast } from "sonner";

export default function SettlementDetails({
  details,
}: {
  details: RouterOutput["workspace"]["claims"]["getClaim"]["settlementInfo"];
}) {
  const {
    claimHash,
    matched,
    status: statusRaw,
    txHash,
    settledDate,
  } = details;
  const status = statuses.find((status) => status.value === statusRaw)!;
  const copyClick = () => {
    claimHash && navigator.clipboard.writeText(claimHash);
    toast.success("Hash copied");
  };
  return (
    <Card className="">
      <div className="flex flex-col justify-between space-y-10 border-b border-tremor-border bg-tremor-background-muted px-6 pb-4 pt-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background">
        <div>
          <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Settlement Details
          </h3>
        </div>
      </div>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Claim Status</span>
              <span>
                <div className="flex w-fit items-center">
                  {status.icon && (
                    <status.icon className={cn("mr-2 h-4 w-4", status.color)} />
                  )}
                  <span>{status.label}</span>
                </div>
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Match Status</span>
              <span>
                {matched ? (
                  <div className="flex w-fit items-center">
                    <PlusCircledIcon className={"mr-2 h-4 w-4 text-cyan-500"} />
                    <span>Matched</span>
                  </div>
                ) : (
                  <div className="flex w-fit items-center">
                    <MinusCircledIcon className={"mr-2 h-4 w-4 text-red-500"} />
                    <span>Not matched</span>
                  </div>
                )}
              </span>
            </li>
          </ul>
        </div>

        <Separator className="my-4" />
        <div className="grid gap-3">
          <dl className="grid gap-3">
            {claimHash && (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Claim Hash</dt>
                <dd>
                  <Button
                    variant={"link"}
                    onClick={copyClick}
                    className="m-0 h-fit w-fit p-0"
                  >
                    {shortenAddress(claimHash)}
                  </Button>
                </dd>
              </div>
            )}
            {txHash && (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Transaction Hash</dt>
                <dd>
                  <Link
                    href={`https://sn2-stavanger-blockscout.eu-north-2.gateway.fm/tx/${txHash}`}
                    target="_blank"
                    className={cn(
                      buttonVariants({
                        variant: "link",
                      }),
                      "h-fit p-0",
                    )}
                  >
                    {shortenAddress(txHash)}
                  </Link>
                </dd>
              </div>
            )}

            {settledDate && (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Settlement Date</dt>
                <dd>
                  <span>{settledDate.toDateString()}</span>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
