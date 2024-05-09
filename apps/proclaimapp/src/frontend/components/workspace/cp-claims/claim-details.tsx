import { Button } from "@/frontend/components/ui/button";
import { HoverCardContent } from "@/frontend/components/ui/hover-card";
import { shortenAddress } from "@/frontend/lib/utils";
import { Divider } from "@tremor/react";
import { toast } from "sonner";

type Props = {
  claim: {
    hash: string;
    paydate: string;
    csd: string;
    asd: string;
    ca: string;
    market: string;
    eventRate: string;
    qty: number;
    ccy: string;
    owner: string;
    amount: number;
  };
};

export default function ClaimDetails({ claim }: Props) {
  const { amount, asd, ca, ccy, csd, hash, paydate, qty } = claim;
  const copyClick = () => {
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied");
  };
  return (
    <HoverCardContent className="w-96" dir="right">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Claim Hash:
          </div>

          <Button
            variant={"link"}
            onClick={copyClick}
            className="m-0 h-fit w-fit p-0"
          >
            {shortenAddress(hash)}
          </Button>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            CA Event:
          </div>
          <div className="text-sm font-medium">{ca}</div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Pay Date:
          </div>
          <div className="text-sm font-medium">
            {new Date(Number(paydate)).toDateString()}
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            ASD:
          </div>
          <div className="text-sm font-medium">
            {new Date(Number(asd)).toDateString()}
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            CSD:
          </div>
          <div className="text-sm font-medium">
            {new Date(Number(csd)).toDateString()}
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Quantity:
          </div>
          <div className="text-sm font-medium">{qty}</div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Amount:
          </div>
          <div className="text-sm font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currency: ccy,
            }).format(Number(amount))}
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Event Type:
          </div>
          <div className="text-sm font-medium">Lending</div>
        </div>
      </div>
    </HoverCardContent>
  );
}
