import type { DailyPoint } from "@/data/prismb";

interface MetrikaRow {
  dimensions: { name: string }[];
  metrics: number[];
}

interface MetrikaResponse {
  data?: MetrikaRow[];
  errors?: { message: string }[];
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }).replace(".", "").replace(" г.", "");
}

export async function fetchMetrikaTraffic(token: string, counterId: string, days = 30): Promise<DailyPoint[] | null> {
  const date2 = new Date();
  const date1 = new Date(date2);
  date1.setDate(date1.getDate() - days + 1);

  const params = new URLSearchParams({
    ids: counterId,
    metrics: "ym:s:visits,ym:s:goal1reaches",
    dimensions: "ym:s:date",
    date1: date1.toISOString().slice(0, 10),
    date2: date2.toISOString().slice(0, 10),
    sort: "ym:s:date",
    limit: String(days),
  });

  try {
    const res = await fetch(`https://api-metrika.yandex.net/stat/v1/data?${params}`, {
      headers: { Authorization: `OAuth ${token}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as MetrikaResponse;
    if (!json.data) return null;

    return json.data.map((row) => {
      const isoDate = row.dimensions[0]?.name ?? "";
      const dateObj = new Date(isoDate);
      return {
        date: formatDate(dateObj),
        visits: Math.round(row.metrics[0] ?? 0),
        leads: Math.round(row.metrics[1] ?? 0),
      };
    });
  } catch {
    return null;
  }
}
