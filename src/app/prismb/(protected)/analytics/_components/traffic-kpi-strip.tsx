import { ArrowDownRight, ArrowUpRight, Ellipsis } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChannelItem, Last30DaysType } from "@/data/prismb";

interface Props {
  metrics: Last30DaysType;
  channels: ChannelItem[];
}

export function TrafficKpiStrip({ metrics, channels }: Props) {
  const { trafficTotal, conversionRate } = metrics;
  const totalClicks = channels.reduce((s, c) => s + c.clicks, 0);
  const totalLeads = channels.reduce((s, c) => s + c.leads, 0);
  const avgCtr = channels.length > 0 && totalClicks > 0 ? Math.round((totalLeads / totalClicks) * 1000) / 10 : 0;
  const bounceRate = Math.round(Math.max(40, 100 - conversionRate * 15));

  const kpis = [
    { label: "Посетители", value: trafficTotal.toLocaleString("ru-RU"), delta: "+8.4%", up: true, from: "за 30 дней" },
    {
      label: "Кликов по рекламе",
      value: totalClicks.toLocaleString("ru-RU"),
      delta: "+3.1%",
      up: true,
      from: `${channels.length} канала`,
    },
    { label: "CTR (клик→лид)", value: `${avgCtr}%`, delta: "-0.3%", up: false, from: "средний по каналам" },
    { label: "Отказы", value: `${bounceRate}%`, delta: "-2.1%", up: true, from: "ниже — лучше" },
    { label: "Конверсия сайта", value: `${conversionRate}%`, delta: "+0.2%", up: true, from: "визит → лид" },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
      <div className="grid divide-y *:rounded-none *:border-0 *:shadow-none *:ring-0 md:grid-cols-3 md:divide-x md:divide-y-0 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardTitle className="font-normal text-sm">{kpi.label}</CardTitle>
              <CardAction>
                <Ellipsis className="size-4" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-2xl leading-none tracking-tight tabular-nums">{kpi.value}</div>
                <Badge
                  className={
                    kpi.up
                      ? "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                      : "bg-destructive/10 text-destructive"
                  }
                >
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.delta}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{kpi.from}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
