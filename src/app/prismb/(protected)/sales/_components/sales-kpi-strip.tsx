"use client";

import { DollarSign, Percent, Receipt, ShoppingBag, Target, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import type { CompanyProfileType, DailyPoint, Last30DaysType } from "@/data/prismb";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

interface Props {
  metrics: Last30DaysType;
  companyProfile: CompanyProfileType;
  dailyTrafficData: DailyPoint[];
}

export function SalesKpiStrip({ metrics, companyProfile, dailyTrafficData }: Props) {
  const { revenue, totalOrders, totalLeads, roi, cpa, conversionRate } = metrics;
  const { avgOrderValue, targetCPA } = companyProfile;
  const orderRate = totalLeads > 0 ? totalOrders / totalLeads : 0;

  const chartData = dailyTrafficData.map((d) => ({
    date: d.date,
    revenue: Math.round(d.leads * orderRate * avgOrderValue),
  }));

  const cells = [
    {
      icon: DollarSign,
      label: "Доход за месяц",
      value: fmt(revenue),
      delta: "+12% к прошлому мес.",
      pos: true as boolean | null,
    },
    {
      icon: ShoppingBag,
      label: "Заказов",
      value: String(totalOrders),
      delta: "+4 к прошлому мес.",
      pos: true as boolean | null,
    },
    { icon: Receipt, label: "Средний чек", value: fmt(avgOrderValue), delta: "стабильно", pos: null as boolean | null },
    {
      icon: TrendingUp,
      label: "ROI рекламы",
      value: `${roi}%`,
      delta: roi >= 250 ? "≥ цели 250%" : "ниже цели 250%",
      pos: (roi >= 250) as boolean | null,
    },
    {
      icon: Target,
      label: "CPA",
      value: fmt(cpa),
      delta: cpa <= targetCPA ? `≤ цели ${fmt(targetCPA)}` : `выше цели ${fmt(targetCPA)}`,
      pos: (cpa <= targetCPA) as boolean | null,
    },
    {
      icon: Percent,
      label: "Конверсия",
      value: `${conversionRate}%`,
      delta: "посетитель → лид",
      pos: null as boolean | null,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="grid grid-cols-1 xl:grid-cols-12">
        <div className="grid grid-cols-2 xl:col-span-5 xl:border-r border-border">
          {cells.map((cell, i) => (
            <div key={cell.label} className={cn("p-4 border-border", i < 4 && "border-b", i % 2 === 0 && "border-r")}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{cell.label}</span>
                <cell.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="text-xl font-semibold tabular-nums leading-none">{cell.value}</div>
              <div
                className={cn(
                  "mt-1 text-xs",
                  cell.pos === true && "text-green-600",
                  cell.pos === false && "text-destructive",
                  cell.pos === null && "text-muted-foreground",
                )}
              >
                {cell.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="xl:col-span-7 p-4 flex flex-col gap-3">
          <span className="text-sm font-medium">Динамика выручки за 30 дней</span>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} interval={4} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                formatter={(v) => [typeof v === "number" ? v.toLocaleString("ru-RU") + " ₽" : "", "Выручка"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#revGrad)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
