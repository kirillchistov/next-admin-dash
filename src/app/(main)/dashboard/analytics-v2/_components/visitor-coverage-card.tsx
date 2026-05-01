"use client";

import { Ellipsis } from "lucide-react";
import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const coverageData = [
  { day: 1, visitors: 34 },
  { day: 2, visitors: 39 },
  { day: 3, visitors: 42 },
  { day: 4, visitors: 48 },
  { day: 5, visitors: 36 },
  { day: 6, visitors: 28 },
  { day: 7, visitors: 31 },
  { day: 8, visitors: 26 },
  { day: 9, visitors: 44 },
  { day: 10, visitors: 52 },
  { day: 11, visitors: 38 },
  { day: 12, visitors: 46 },
  { day: 13, visitors: 50 },
  { day: 14, visitors: 36 },
  { day: 15, visitors: 42 },
  { day: 16, visitors: 48 },
  { day: 17, visitors: 58.2, highlight: true },
  { day: 18, visitors: 39 },
  { day: 19, visitors: 31 },
  { day: 20, visitors: 43 },
  { day: 21, visitors: 51 },
  { day: 22, visitors: 47 },
  { day: 23, visitors: 36 },
  { day: 24, visitors: 53 },
  { day: 25, visitors: 45 },
  { day: 26, visitors: 30 },
  { day: 27, visitors: 37 },
  { day: 28, visitors: 41 },
];

const chartConfig = {
  visitors: {
    color: "var(--chart-1)",
    label: "Visitors",
  },
} satisfies ChartConfig;

function formatWeekTick(value: number) {
  if (value === 4) return "01-07";
  if (value === 11) return "08-14";
  if (value === 18) return "15-21";
  if (value === 25) return "22-28";

  return "";
}

export function VisitorCoverageCard() {
  return (
    <Card className="xl:col-span-5">
      <CardHeader>
        <CardTitle className="font-normal leading-none">Visitor Distribution</CardTitle>
        <CardAction>
          <Ellipsis className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-54 w-full">
          <BarChart data={coverageData} margin={{ bottom: 0, left: 0, right: 0, top: 20 }} barCategoryGap={3}>
            <ReferenceLine y={42} stroke="var(--foreground)" strokeDasharray="3 8" strokeOpacity={0.9} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tickFormatter={formatWeekTick}
              ticks={[4, 11, 18, 25]}
              tickMargin={16}
            />
            <YAxis hide domain={[0, 68]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={(value) => `${value}k`} />}
            />
            <Bar dataKey="visitors" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
