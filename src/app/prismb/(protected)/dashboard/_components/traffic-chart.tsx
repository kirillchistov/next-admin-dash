"use client";

import { useState } from "react";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyPoint } from "@/data/prismb";
import { cn } from "@/lib/utils";

interface Props {
  data: DailyPoint[];
}

const PERIODS = [
  { label: "7 дн", days: 7 },
  { label: "14 дн", days: 14 },
  { label: "30 дн", days: 30 },
] as const;

const METRICS = [
  { key: "visits" as const, label: "Посетители", color: "#3b82f6", gradientId: "colorVisits" },
  { key: "leads" as const, label: "Лиды", color: "#10b981", gradientId: "colorLeads" },
] as const;

export function TrafficChart({ data = [] }: Props) {
  const [period, setPeriod] = useState<7 | 14 | 30>(30);
  const [activeMetric, setActiveMetric] = useState<"both" | "visits" | "leads">("both");

  const sliced = data.slice(-period);
  const showVisits = activeMetric !== "leads";
  const showLeads = activeMetric !== "visits";

  const chartData = sliced.map((d) => ({
    date: d.date,
    visits: d.visits,
    leadsScaled: d.leads * 20,
    leadsRaw: d.leads,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Трафик</CardTitle>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setPeriod(p.days)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs transition-colors",
                  period === p.days ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 flex gap-3">
          {(["both", ...METRICS.map((m) => m.key)] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveMetric(key)}
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors",
                activeMetric === key
                  ? "bg-slate-100 font-medium text-slate-900"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              {key === "both" ? (
                "Все"
              ) : (
                <>
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: METRICS.find((m) => m.key === key)?.color }}
                  />
                  {METRICS.find((m) => m.key === key)?.label}
                </>
              )}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
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
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              interval={period === 7 ? 0 : period === 14 ? 1 : 4}
            />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
              formatter={(value: number, name: string) => {
                if (name === "leadsScaled") return [Math.round(value / 20), "Лиды"];
                return [value, "Посетители"];
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            {showVisits && (
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorVisits)"
                name="visits"
              />
            )}
            {showLeads && (
              <Area
                type="monotone"
                dataKey="leadsScaled"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorLeads)"
                name="leadsScaled"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
