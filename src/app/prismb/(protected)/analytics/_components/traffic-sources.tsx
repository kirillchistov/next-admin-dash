import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChannelItem } from "@/data/prismb";

interface Props {
  channels: ChannelItem[];
}

export function TrafficSources({ channels }: Props) {
  const totalClicks = channels.reduce((s, c) => s + c.clicks, 0);

  const rows = channels
    .map((ch) => ({
      name: ch.name,
      clicks: ch.clicks,
      leads: ch.leads,
      ctr: ch.clicks > 0 ? Math.round((ch.leads / ch.clicks) * 1000) / 10 : 0,
      pct: totalClicks > 0 ? Math.round((ch.clicks / totalClicks) * 100) : 0,
      color: ch.color,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Источники трафика</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div key={row.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: row.color }} />
                <span className="font-medium">{row.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>CTR лид: {row.ctr}%</span>
                <span className="font-semibold tabular-nums text-foreground">{row.clicks.toLocaleString("ru-RU")}</span>
                <span className="w-8 text-right">{row.pct}%</span>
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${row.pct}%`, background: row.color }}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">Всего кликов</span>
          <span className="font-semibold tabular-nums">{totalClicks.toLocaleString("ru-RU")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
