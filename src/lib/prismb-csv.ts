import type { ChannelItem } from "@/data/prismb";

// Яндекс.Директ CSV export column names (ru)
const COL_CAMPAIGN = ["Кампания", "Название кампании", "Campaign"];
const COL_COST = ["Стоимость", "Расход", "Cost", "Стоимость (руб.)"];
const COL_CLICKS = ["Клики", "Clicks"];
const COL_CONVERSIONS = ["Конверсии", "Целевые действия", "Conversions", "Заявки"];

const CHANNEL_COLORS: Record<string, string> = {
  "Яндекс.Директ": "#f59e0b",
  Директ: "#f59e0b",
  direct: "#f59e0b",
  vk: "#3b82f6",
  "vk ads": "#3b82f6",
  seo: "#10b981",
  avito: "#8b5cf6",
  telegram: "#0ea5e9",
};

function colorFor(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, color] of Object.entries(CHANNEL_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "#94a3b8";
}

function findCol(header: string[], candidates: string[]): number {
  return header.findIndex((h) => candidates.some((c) => h.toLowerCase().includes(c.toLowerCase())));
}

function parseNum(s: string): number {
  return Number(s.replace(/[^\d.]/g, "")) || 0;
}

export interface CsvParseResult {
  channels: ChannelItem[];
  errors: string[];
}

export function parseDirectCsv(text: string): CsvParseResult {
  const errors: string[] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { channels: [], errors: ["Файл пустой или содержит менее 2 строк"] };

  // Detect separator
  const sep = lines[0].includes("\t") ? "\t" : ";";
  const header = lines[0].split(sep).map((h) => h.trim().replace(/^["']|["']$/g, ""));

  const iCampaign = findCol(header, COL_CAMPAIGN);
  const iCost = findCol(header, COL_COST);
  const iClicks = findCol(header, COL_CLICKS);
  const iConv = findCol(header, COL_CONVERSIONS);

  if (iCampaign === -1) errors.push("Не найдена колонка с названием кампании");
  if (iCost === -1) errors.push("Не найдена колонка с расходом");
  if (errors.length) return { channels: [], errors };

  // Aggregate by campaign
  const agg: Record<string, { spend: number; clicks: number; leads: number }> = {};
  for (const line of lines.slice(1)) {
    const cols = line.split(sep).map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const name = cols[iCampaign] ?? "";
    if (!name) continue;
    const spend = parseNum(cols[iCost] ?? "");
    const clicks = iClicks !== -1 ? parseNum(cols[iClicks] ?? "") : 0;
    const leads = iConv !== -1 ? parseNum(cols[iConv] ?? "") : 0;
    if (!agg[name]) agg[name] = { spend: 0, clicks: 0, leads: 0 };
    agg[name].spend += spend;
    agg[name].clicks += clicks;
    agg[name].leads += leads;
  }

  const channels: ChannelItem[] = Object.entries(agg).map(([name, v]) => ({
    name,
    spend: Math.round(v.spend),
    clicks: v.clicks,
    leads: v.leads,
    cpa: v.leads > 0 ? Math.round(v.spend / v.leads) : 0,
    cpl: v.leads > 0 ? Math.round(v.spend / v.leads) : 0,
    color: colorFor(name),
  }));

  if (!channels.length) errors.push("Не удалось извлечь данные из файла");
  return { channels, errors };
}
