"use client";

import { Divider } from "@tremor/react";
import KPI from "./kpi";
import BarChartComponent from "./bar-chart";
import ChartComposition from "./chart-composition";
import { RouterOutput } from "@/server/api/root";

export default function OverviewMain({
  data,
}: {
  data: RouterOutput["overview"]["getData"];
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-tremor-title font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong ">
            Overview
          </h3>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid flex-1 grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <KPI data={data.kpi} />
          <ChartComposition data={data.groupedType} />
        </div>
        <div>
          <BarChartComponent data={data.barStats} />
        </div>
      </div>
    </div>
  );
}
