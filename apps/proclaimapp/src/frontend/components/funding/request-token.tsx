import { Coins, DollarSign } from "lucide-react";
import { Card } from "../ui/card";
import { ChangeEvent, useState } from "react";
import { RequestsTable } from "./requests-table";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function RequestToken({
  ccy,
  requests,
  handleRefetch,
}: {
  ccy: string;
  requests: RouterOutput["funding"]["getGeneralData"]["requests"];
  handleRefetch: () => Promise<void>;
}) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: ccy,
    minimumFractionDigits: 0,
  });
  const numberFormatter = new Intl.NumberFormat("en-US", {
    currency: ccy,
    minimumFractionDigits: 2,
  });
  const [value, setValue] = useState("");
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const numericValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
    setValue(numericValue);
  };
  const displayValue = value ? currencyFormatter.format(Number(value)) : "";
  const displayNumber = numberFormatter.format(Number(value));
  const { mutate, isPending } = api.funding.requestTokens.useMutation({
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
      });
    },
    onSuccess: async (data) => {
      await handleRefetch();
      toast.success("Success", {
        description: `Funded ${numberFormatter.format(data.amount)}`,
      });
      setValue("");
    },
  });
  const handleRequest = () => {
    mutate({ token: ccy, amount: Number(value) });
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center bg-white text-gray-900">
        <div className="rounded-lg  p-6 shadow-lg">
          <div className="mb-4 text-center">
            <h1 className="text-4xl font-bold">Request Tokens</h1>
            <p className="text-gray-600">Enter the amount</p>
          </div>
          <div className="flex items-center justify-center">
            <input
              className="w-full bg-transparent text-center text-5xl font-bold focus:outline-none"
              placeholder="$0"
              type="text"
              value={displayValue} // Display value with dollar sign
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-gray-600">Request: {ccy}t</span>
              <span className="flex items-center gap-2 font-bold">
                <Coins size={20} /> {displayNumber}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-gray-600">Transfer: {ccy}</span>
              <span className="flex items-center gap-2 font-bold">
                <DollarSign size={20} /> {displayNumber}
              </span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleRequest}
              variant={"default"}
              loading={isPending}
            >
              Request Tokens
            </Button>
          </div>
        </div>
      </div>
      <RequestsTable requests={requests} ccy={ccy} />
    </div>
  );
}
