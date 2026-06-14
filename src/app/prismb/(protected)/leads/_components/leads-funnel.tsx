"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChannelItem, Last30DaysType } from "@/data/prismb";

interface Props {
  metrics: Last30DaysType;
  channels: ChannelItem[];
}

const STAGE_COLORS = ["#94a3b8", "#60a5fa", "#34d399", "#f59e0b"];

export function LeadsFunnel({ metrics, channels }: Props) {
  const { trafficTotal, totalLeads, totalOrders } = metrics;
  const totalClicks = channels.reduce((s, c) => s + c.clicks, 0);

  const stages = [
    { stage: "Посетители сайта", value: trafficTotal },
    { stage: "Клики по рекламе", value: totalClicks },
    { stage: "Лиды", value: totalLeads },
    { stage: "Заказы", value: totalOrders },
  ];

  const channelData = channels.map((ch) => ({
    name: ch.name,
    Клики: ch.clicks,
    Лиды: ch.leads,
    fill: ch.color,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-5">
        <CardHeader>
          <CardTitle>Воронка продаж</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stages.map((s, i) => {
            const pct = Math.round((s.value / trafficTotal) * 100);
            const convToNext = i < stages.length - 1 ? Math.round((stages[i + 1].value / s.value) * 100) : null;
            return (
              <div key={s.stage}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{s.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold tabular-nums">{s.value.toLocaleString("ru-RU")}</span>
                    <span className="w-10 text-right text-xs text-muted-foreground">{pct}%</span>
                  </div>
                </div>
                <div className="h-6 overflow-hidden rounded-md bg-muted">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{ width: `${Math.max(pct, 2)}%`, background: STAGE_COLORS[i] }}
                  />
                </div>
                {convToNext !== null && (
                  <p className="mt-0.5 text-right text-xs text-muted-foreground">↓ конверсия {convToNext}%</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="xl:col-span-7">
        <CardHeader>
          <CardTitle>Лиды по каналам</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={channelData} layout="vertical" margin={{ left: 16, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                width={100}
              />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="Клики" radius={[0, 4, 4, 0]} fill="#60a5fa" fillOpacity={0.55} barSize={16} />
              <Bar dataKey="Лиды" radius={[0, 4, 4, 0]} fill="#34d399" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400 opacity-55" />
              Клики
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Лиды
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
