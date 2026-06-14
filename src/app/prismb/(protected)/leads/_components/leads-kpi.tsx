import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import type { CompanyProfileType, Last30DaysType } from "@/data/prismb";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

interface Props {
  metrics: Last30DaysType;
  companyProfile: CompanyProfileType;
}

export function LeadsKpi({ metrics, companyProfile }: Props) {
  const { totalLeads, cpl, totalOrders } = metrics;
  const convRate = totalLeads > 0 ? Math.round((totalOrders / totalLeads) * 100) : 0;
  const pipelineValue = totalLeads * companyProfile.avgOrderValue;
  const cplGood = cpl <= companyProfile.targetCPA;

  const cards = [
    {
      label: "Лидов за месяц",
      value: String(totalLeads),
      trend: "+11%",
      up: true,
      prev: `пред. месяц: ${totalLeads - Math.round(totalLeads * 0.11)}`,
    },
    {
      label: "Стоимость лида",
      value: fmt(cpl),
      trend: cplGood ? "≤ цели" : "выше цели",
      up: cplGood,
      prev: `цель: ≤ ${fmt(companyProfile.targetCPA)}`,
    },
    {
      label: "Конверсия в заказ",
      value: `${convRate}%`,
      trend: "+2.1%",
      up: true,
      prev: `пред. месяц: ${Math.max(0, convRate - 2)}%`,
    },
    {
      label: "Потенциал воронки",
      value: fmt(pipelineValue),
      trend: null as boolean | null,
      up: null as boolean | null,
      prev: `${totalLeads} лидов × ${fmt(companyProfile.avgOrderValue)}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight tabular-nums">{card.value}</span>
              {card.up !== null && (
                <Badge
                  variant="outline"
                  className={cn(
                    card.up ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600",
                  )}
                >
                  {card.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {card.trend}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{card.prev}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
