"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ChannelItem, DailyPoint } from "@/data/prismb";

interface Props {
  companyName: string;
  dailyTrafficData: DailyPoint[];
  channelBreakdown: ChannelItem[];
}

function toCsv(rows: string[][]): string {
  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function downloadCsv(content: string, filename: string) {
  const bom = "﻿";
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButton({ companyName, dailyTrafficData, channelBreakdown }: Props) {
  function handleExport() {
    const slug = companyName.toLowerCase().replace(/\s+/g, "-");
    const date = new Date().toISOString().slice(0, 10);

    const trafficCsv = toCsv([
      ["Дата", "Посетители", "Лиды"],
      ...dailyTrafficData.map((d) => [d.date, String(d.visits), String(d.leads)]),
    ]);
    downloadCsv(trafficCsv, `${slug}-traffic-${date}.csv`);

    const channelCsv = toCsv([
      ["Канал", "Расход (₽)", "Клики", "Лиды", "CPA (₽)"],
      ...channelBreakdown.map((c) => [c.name, String(c.spend), String(c.clicks), String(c.leads), String(c.cpa)]),
    ]);
    downloadCsv(channelCsv, `${slug}-channels-${date}.csv`);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
      <Download className="h-3.5 w-3.5" />
      Экспорт CSV
    </Button>
  );
}
