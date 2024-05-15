"use client";

import { RouterOutput } from "@/server/api/root";
import GlobalEvents from "./global-actions";
import UpcomingClaims from "./upcoming-claims";

export default function DashboardComponent({
  data,
}: {
  data: RouterOutput["workspace"]["dashboard"]["getData"];
}) {
  return (
    <div className="grid h-full grid-cols-5 gap-12">
      <div className="col-span-3">
        <GlobalEvents />
      </div>
      <div className="col-span-2">
        <div>
          <UpcomingClaims data={data.claims} />
        </div>
        <div></div>
      </div>
    </div>
  );
}
