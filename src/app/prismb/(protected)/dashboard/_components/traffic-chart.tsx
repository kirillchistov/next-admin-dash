"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DailyPoint } from "@/data/prismb";

interface Props {
  data: DailyPoint[];
}

export function TrafficChart({ data = [] }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    leads: d.leads * 20, // scale for visibility on same axis
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Трафик за 30 дней</CardTitle>
        <CardDescription>Посетители и лиды по дням</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
              formatter={(value: number, name: string) => {
                if (name === "leads") return [Math.round(value / 20), "Лиды"];
                return [value, "Посетители"];
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorVisits)"
              name="visits"
            />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorLeads)"
              name="leads"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-2 flex gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded bg-blue-500" /> Посетители
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded bg-green-500" /> Лиды
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
