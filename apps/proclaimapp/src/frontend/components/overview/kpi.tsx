import { cn, customNumberFormatter } from "@/frontend/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { RouterOutput } from "@/server/api/root";

export default function KPI({
  data,
}: {
  data: RouterOutput["overview"]["getData"]["kpi"];
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="text-center">
            <span className="text-tremor-metric font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {customNumberFormatter(data.totalVolume)}
            </span>

            <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Total Volume
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {data.totalCount}
            </span>

            <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Total Claims
            </p>
          </CardHeader>
        </Card>
        {/* <Card>
          <CardHeader className="text-center">
            <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {data.outstandingCount}
            </span>

            <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Outstanding
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {data.upcomingCount}
            </span>

            <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Upcoming
            </p>
          </CardHeader>
        </Card> */}
      </div>
    </>
  );
}
