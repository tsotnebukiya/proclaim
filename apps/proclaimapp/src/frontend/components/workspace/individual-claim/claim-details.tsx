import { RouterOutput } from "@/server/api/root";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";

export default function ClaimsDetails({
  details,
}: {
  details: RouterOutput["workspace"]["claims"]["getClaim"]["claimInfo"];
}) {
  const {
    account,
    amount,
    asd,
    ccy,
    cpAcc,
    cpName,
    csd,
    eventID,
    eventRate,
    eventType,
    market,
    pd,
    quantity,
    type,
  } = details;
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="grid">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Trade Details</CardTitle>
          </CardHeader>
          <ul className="grid text-sm text-tremor-content-emphasis">
            <li className="flex items-center justify-between bg-accent px-6 py-3 ">
              <span>Contractual Settlement Date</span>
              <span>{csd.toDateString()}</span>
            </li>
            <li className="flex items-center justify-between px-6 py-3">
              <span className="">Actual Settlement Date</span>
              <span className="text-tremor-content-strong">
                {asd.toDateString()}
              </span>
            </li>
            <li className="flex items-center justify-between bg-accent px-6 py-3">
              <span className="">Market</span>
              <span className="text-tremor-content-strong">{market}</span>
            </li>
            <li className="flex items-center justify-between px-6 py-3">
              <span className="">Account</span>
              <span>14232</span>
            </li>
            <li className="flex items-center justify-between bg-accent px-6 py-3">
              <span className="">Counterparty</span>
              <span>
                {cpName} / {cpAcc}
              </span>
            </li>
            <li className="flex items-center justify-between  px-6 py-3">
              <span className="">Type</span>
              <span>{type}</span>
            </li>
            <li className="flex items-center justify-between bg-accent px-6 py-3 ">
              <span className="">Quantity</span>
              <span>{quantity.toLocaleString()}</span>
            </li>
          </ul>
        </div>
        <Separator className="mb-3" />

        <div className="grid">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Event Details</CardTitle>
          </CardHeader>
          <ul className="grid text-sm">
            <li className="flex items-center justify-between bg-accent px-6 py-3">
              <span className="">Event Type</span>
              <span className="text-tremor-content-strong">{eventType}</span>
            </li>
            <li className="flex items-center justify-between px-6 py-3">
              <span className="">Event ID</span>
              <span className="text-tremor-content-strong">{eventID}</span>
            </li>
            <li className="flex items-center justify-between bg-accent px-6 py-3">
              <span className="">Rate</span>
              <span className="text-tremor-content-strong">{eventRate}</span>
            </li>
            <li className="flex items-center justify-between px-6 py-3 ">
              <span className="">Pay Date</span>
              <span>{pd.toDateString()}</span>
            </li>
          </ul>
        </div>
        <Separator className="mb-4" />
        <div className="grid">
          <ul className="grid">
            <li className="flex items-center justify-between px-6 py-3 font-bold">
              <span className="">Claim Amount</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  currency: ccy.toLocaleLowerCase() === "usd" ? "usd" : "eur",
                }).format(Number(amount))}
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
