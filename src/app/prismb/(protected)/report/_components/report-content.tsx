"use client";

import { CheckCircle2, Database } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { WeeklyReport } from "@/data/prismb";

interface Props {
  clientName: string;
  report: WeeklyReport;
}

export function ReportContent({ clientName, report }: Props) {
  const chartData = report.days.map((d) => ({
    date: d.date,
    Посетители: d.visits,
    Лиды: d.leads * 30,
    leadsRaw: d.leads,
  }));

  const totalVisits = report.days.reduce((s, d) => s + d.visits, 0);
  const totalLeads = report.days.reduce((s, d) => s + d.leads, 0);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Недельный отчёт</h1>
        <p className="mt-1 text-sm text-slate-500">2–8 июня 2025 · {clientName}</p>
      </div>

      {/* Summary numbers */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{totalVisits.toLocaleString("ru-RU")}</div>
            <div className="mt-0.5 text-xs text-slate-500">Посетителей</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{totalLeads}</div>
            <div className="mt-0.5 text-xs text-slate-500">Лидов</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {totalLeads > 0 && totalVisits > 0 ? Math.round((totalLeads / totalVisits) * 10000) / 100 : 0}%
            </div>
            <div className="mt-0.5 text-xs text-slate-500">Конверсия</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Трафик по дням</CardTitle>
          <CardDescription>Посетители и лиды за последние 7 дней</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "Лиды") return [Math.round(value / 30), "Лиды"];
                  return [value, name];
                }}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
              <Bar dataKey="Посетители" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Лиды" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* What happened */}
      <Card>
        <CardHeader>
          <CardTitle>Что произошло за неделю</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {report.summary.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* What to do */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle>Что делать на следующей неделе</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {report.actions.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {i + 1}
                </div>
                <span className="text-slate-800">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Database className="h-3 w-3" />
        <span>Источник данных: Яндекс.Метрика, Яндекс.Директ API, VK Ads API · Обновлено: 9 июня 2025, 08:00</span>
      </div>
    </div>
  );
}
