import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChannelItem, Last30DaysType } from "@/data/prismb";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

interface Props {
  channels: ChannelItem[];
  metrics: Last30DaysType;
  avgOrderValue: number;
}

export function ChannelRevenue({ channels, metrics, avgOrderValue }: Props) {
  const { totalOrders, totalLeads } = metrics;
  const orderRate = totalLeads > 0 ? totalOrders / totalLeads : 0;

  const rows = channels.map((ch) => {
    const estOrders = Math.round(ch.leads * orderRate);
    const estRevenue = estOrders * avgOrderValue;
    const roi = ch.spend > 0 ? Math.round((estRevenue / ch.spend) * 100) : 0;
    return { ...ch, estOrders, estRevenue, roi };
  });

  const maxRevenue = Math.max(...rows.map((r) => r.estRevenue), 1);
  const total = rows.reduce((s, r) => s + r.estRevenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Выручка по каналам</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {rows.map((row) => (
          <div key={row.name} className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
                <span className="font-medium">{row.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">
                  {row.leads} лидов · {row.estOrders} заказов
                </span>
                <span className="font-semibold tabular-nums text-sm">{fmt(row.estRevenue)}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "min-w-[4.5rem] justify-center",
                    row.roi >= 300
                      ? "border-green-200 bg-green-50 text-green-700"
                      : row.roi >= 200
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                        : "border-red-200 bg-red-50 text-red-700",
                  )}
                >
                  ROI {row.roi}%
                </Badge>
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(row.estRevenue / maxRevenue) * 100}%`, background: row.color }}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">Итого расчётная выручка</span>
          <span className="font-semibold tabular-nums">{fmt(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
