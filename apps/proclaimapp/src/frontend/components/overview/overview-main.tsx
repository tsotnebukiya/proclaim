"use client";

import { Divider } from "@tremor/react";
import KPI from "./kpi";
import BarChartComponent from "./bar-chart";
import ChartComposition from "./chart-composition";
import { RouterOutput } from "@/server/api/root";
import UpcomingClaims from "./upcoming-claims";
import SettledPending from "./settled-pending";

export default function OverviewMain({
  data,
}: {
  data: RouterOutput["overview"]["getData"];
}) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-3 flex flex-col gap-[18px]">
          <KPI data={data.kpi} />
          <div>
            <SettledPending data={data.oldClaims} />
          </div>
          <BarChartComponent data={data.barStats} />
        </div>
        <div className="col-span-2 flex flex-col gap-8">
          <ChartComposition data={data.groupedType} />
          <UpcomingClaims data={data.claims} />
        </div>
      </div>
    </div>
  );
}
