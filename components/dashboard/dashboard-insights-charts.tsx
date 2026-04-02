"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Hint } from "@/components/ui/hint";
import type {
  CustomerStatusPoint,
  MonthlyRevenuePoint,
} from "@/modules/dashboard/queries";
import { formatCurrency } from "@/lib/utils";

const revenueChartConfig = {
  revenue: {
    color: "#786452",
    label: "Revenue",
  },
} as const;

const customerChartConfig = {
  count: {
    color: "#a5907e",
    label: "Customers",
  },
} as const;

type DashboardInsightsChartsProps = {
  customerStatusSeries: CustomerStatusPoint[];
  monthlyRevenueSeries: MonthlyRevenuePoint[];
};

export function DashboardInsightsCharts({
  customerStatusSeries,
  monthlyRevenueSeries,
}: DashboardInsightsChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.08fr,0.92fr]">
      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Revenue rhythm</CardTitle>
              <Hint>Booked revenue over the last six months using booking-time snapshots.</Hint>
            </div>
            <CardDescription>
              A quicker read on whether demand is growing steadily or clustering unevenly.
            </CardDescription>
          </div>
        </div>

        <ChartContainer className="h-[260px]" config={revenueChartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={monthlyRevenueSeries}>
              <CartesianGrid vertical={false} />
              <XAxis axisLine={false} dataKey="month" tickLine={false} tickMargin={10} />
              <YAxis
                axisLine={false}
                tickFormatter={(value) => formatCurrency(Number(value))}
                tickLine={false}
                width={88}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(value) => formatCurrency(Number(value))}
                  />
                }
                cursor={{ fill: "rgba(230,253,255,0.42)" }}
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                maxBarSize={48}
                radius={[10, 10, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Customer segment mix</CardTitle>
              <Hint>Lightweight lifecycle breakdown based on each customer&apos;s current status.</Hint>
            </div>
            <CardDescription>
              Helpful for spotting whether the business is attracting leads or retaining active clients.
            </CardDescription>
          </div>
        </div>

        <ChartContainer className="h-[260px]" config={customerChartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={customerStatusSeries} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis axisLine={false} tickLine={false} type="number" />
              <YAxis
                axisLine={false}
                dataKey="status"
                tickLine={false}
                type="category"
                width={72}
              />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="count" fill="var(--color-count)" radius={10} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>
    </div>
  );
}
