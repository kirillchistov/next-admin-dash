import { TrendingUp, DollarSign, BarChart2, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyProfileType, Last30DaysType } from "@/data/prismb";
import { cn } from "@/lib/utils";

function formatRub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

interface Props {
  companyProfile: CompanyProfileType;
  metrics: Last30DaysType;
}

type Status = "green" | "yellow" | "red";
function statusBadge(s: Status, labels: [string, string, string]) {
  return {
    label: labels[s === "green" ? 0 : s === "yellow" ? 1 : 2],
    variant: s === "green" ? "secondary" : s === "yellow" ? "outline" : ("destructive" as const),
    color:
      s === "green"
        ? "bg-green-100 text-green-700 border-green-200"
        : s === "yellow"
          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
          : "",
  };
}

export function KPICards({ companyProfile, metrics }: Props) {
  const { monthlyAdBudget, targetCPA } = companyProfile;
  const { totalSpend, revenue, roi, cpa } = metrics;

  const budgetPct = Math.round((totalSpend / monthlyAdBudget) * 100);
  const roiStatus: Status = roi >= 250 ? "green" : roi >= 200 ? "yellow" : "red";
  const cpaStatus: Status = cpa <= targetCPA ? "green" : cpa <= targetCPA * 1.1 ? "yellow" : "red";
  const roiBadge = statusBadge(roiStatus, ["Норма", "Внимание", "Проблема"]);
  const cpaBadge = statusBadge(cpaStatus, ["Норма", "Внимание", "Выше цели"]);

  const cards = [
    {
      title: "Потрачено этот месяц",
      value: formatRub(totalSpend),
      subtitle: `бюджет: ${formatRub(monthlyAdBudget)}`,
      badge: `${budgetPct}%`,
      badgeVariant: budgetPct > 95 ? "destructive" : "secondary",
      badgeColor: "",
      icon: DollarSign,
      iconColor: "text-blue-500",
    },
    {
      title: "Заработано с рекламы",
      value: formatRub(revenue),
      subtitle: "+12% к прошлому месяцу",
      badge: "+12%",
      badgeVariant: "secondary" as const,
      badgeColor: "",
      icon: TrendingUp,
      iconColor: "text-green-500",
      subtitleColor: "text-green-600",
    },
    {
      title: "ROI рекламы",
      value: `${roi}%`,
      subtitle: roiStatus === "green" ? "выше цели 250%" : "цель: 250%",
      badge: roiBadge.label,
      badgeVariant: roiBadge.variant,
      badgeColor: roiBadge.color,
      icon: BarChart2,
      iconColor: "text-purple-500",
    },
    {
      title: "Стоимость клиента",
      value: formatRub(cpa),
      subtitle: `цель: ≤${formatRub(targetCPA)}`,
      badge: cpaBadge.label,
      badgeVariant: cpaBadge.variant,
      badgeColor: cpaBadge.color,
      icon: Target,
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{card.title}</CardTitle>
            <card.icon className={cn("h-4 w-4", card.iconColor)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{card.value}</div>
            <div className="mt-1 flex items-center justify-between">
              <p className={cn("text-xs", card.subtitleColor ?? "text-slate-500")}>{card.subtitle}</p>
              <Badge
                variant={card.badgeVariant as "destructive" | "secondary" | "outline"}
                className={cn("text-xs", card.badgeColor)}
              >
                {card.badge}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
