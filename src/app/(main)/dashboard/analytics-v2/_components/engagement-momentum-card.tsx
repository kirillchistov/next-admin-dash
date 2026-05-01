"use client";

import { Ellipsis } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const engagementData = [
  { date: "2026-04-01T02:24:00Z", engagedVisits: -1.8, lowIntentVisits: 1.6 },
  { date: "2026-04-02T02:24:00Z", engagedVisits: -2.1, lowIntentVisits: 0.2 },
  { date: "2026-04-03T02:24:00Z", engagedVisits: -1.3, lowIntentVisits: 1.8 },
  { date: "2026-04-04T02:24:00Z", engagedVisits: -1.7, lowIntentVisits: 0.8 },
  { date: "2026-04-05T02:24:00Z", engagedVisits: -0.2, lowIntentVisits: 2.0 },
  { date: "2026-04-06T02:24:00Z", engagedVisits: -3.0, lowIntentVisits: 1.2 },
  { date: "2026-04-07T02:24:00Z", engagedVisits: -1.1, lowIntentVisits: 1.5 },
  { date: "2026-04-08T02:24:00Z", engagedVisits: -1.6, lowIntentVisits: 1.7 },
  { date: "2026-04-09T02:24:00Z", engagedVisits: -0.6, lowIntentVisits: -0.1 },
  { date: "2026-04-10T02:24:00Z", engagedVisits: 0.4, lowIntentVisits: 0.5 },
  { date: "2026-04-11T02:24:00Z", engagedVisits: -0.7, lowIntentVisits: -0.4 },
  { date: "2026-04-12T02:24:00Z", engagedVisits: -2.3, lowIntentVisits: 0.1 },
  { date: "2026-04-13T02:24:00Z", engagedVisits: 1.0, lowIntentVisits: -0.5 },
  { date: "2026-04-14T02:24:00Z", engagedVisits: -0.6, lowIntentVisits: -0.2 },
  { date: "2026-04-15T02:24:00Z", engagedVisits: 0.5, lowIntentVisits: -0.8 },
  { date: "2026-04-16T02:24:00Z", engagedVisits: -1.5, lowIntentVisits: -0.4 },
  { date: "2026-04-17T02:24:00Z", engagedVisits: -1.8, lowIntentVisits: -1.3 },
  { date: "2026-04-18T02:24:00Z", engagedVisits: -0.8, lowIntentVisits: -0.8 },
  { date: "2026-04-19T02:24:00Z", engagedVisits: -1.5, lowIntentVisits: -1.0 },
  { date: "2026-04-20T02:24:00Z", engagedVisits: 0.8, lowIntentVisits: -1.3 },
  { date: "2026-04-21T02:24:00Z", engagedVisits: -2.4, lowIntentVisits: -1.5 },
  { date: "2026-04-22T02:24:00Z", engagedVisits: 0.9, lowIntentVisits: -1.8 },
  { date: "2026-04-23T02:24:00Z", engagedVisits: 0.5, lowIntentVisits: -2.0 },
  { date: "2026-04-24T02:24:00Z", engagedVisits: 1.1, lowIntentVisits: -2.2 },
  { date: "2026-04-25T02:24:00Z", engagedVisits: 1.4, lowIntentVisits: -2.4 },
  { date: "2026-04-26T02:24:00Z", engagedVisits: 1.8, lowIntentVisits: -2.6 },
  { date: "2026-04-27T02:24:00Z", engagedVisits: 2.1, lowIntentVisits: -2.8 },
  { date: "2026-04-28T02:24:00Z", engagedVisits: 3.0, lowIntentVisits: -3.0 },
];

const chartConfig = {
  engagedVisits: {
    color: "var(--chart-3)",
    label: "Engaged visits",
  },
  lowIntentVisits: {
    color: "var(--chart-2)",
    label: "Low-intent visits",
  },
} satisfies ChartConfig;

const chartData = engagementData.map((item, index) => ({
  ...item,
  dayIndex: index + 1,
}));

const weeklyTicks = [4, 11, 18, 25];

function formatWeek(value: number) {
  const weekIndex = weeklyTicks.indexOf(value);

  return weekIndex >= 0 ? `Week ${weekIndex + 1}` : "";
}

export function EngagementMomentumCard() {
  return (
    <Card className="xl:col-span-7">
      <CardHeader>
        <CardTitle className="font-normal">Traffic Quality</CardTitle>
        <CardAction>
          <Ellipsis className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ComposedChart data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <defs>
              <pattern
                id="engaged-visits-pattern"
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="6" height="6" fill="var(--color-engagedVisits)" fillOpacity="0.05" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="var(--color-engagedVisits)"
                  strokeWidth="1.25"
                  strokeOpacity="0.2"
                />
              </pattern>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dayIndex"
              axisLine={false}
              domain={[1, 28]}
              interval={0}
              tickFormatter={formatWeek}
              tickLine={false}
              tickMargin={14}
              ticks={weeklyTicks}
              type="number"
            />
            <YAxis
              axisLine={false}
              domain={[-4, 4]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              tickMargin={10}
              width={34}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="w-56" labelFormatter={() => "Traffic quality"} />}
            />
            <Area
              dataKey="engagedVisits"
              baseValue={-4}
              fill="url(#engaged-visits-pattern)"
              fillOpacity={1}
              stroke="transparent"
              tooltipType="none"
              type="natural"
            />
            <Line
              dataKey="lowIntentVisits"
              dot={false}
              stroke="var(--color-lowIntentVisits)"
              strokeDasharray="4 4"
              strokeWidth={1.25}
              type="natural"
            />
            <Line
              dataKey="engagedVisits"
              dot={false}
              activeDot={{ r: 4 }}
              stroke="var(--color-engagedVisits)"
              strokeWidth={2}
              type="natural"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
