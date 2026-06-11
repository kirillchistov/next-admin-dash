import { AlertCircle, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Rec } from "@/data/prismb";
import { cn } from "@/lib/utils";

const severityConfig = {
  red: {
    icon: AlertCircle,
    iconColor: "text-red-500",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
    borderClass: "border-l-red-500",
    label: "Срочно",
  },
  yellow: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-200",
    borderClass: "border-l-yellow-500",
    label: "Внимание",
  },
  green: {
    icon: CheckCircle2,
    iconColor: "text-green-500",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    borderClass: "border-l-green-500",
    label: "Возможность",
  },
};

export function Recommendations({ items }: { items: Rec[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Рекомендации ИИшника</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((rec) => {
          const config = severityConfig[rec.severity];
          const Icon = config.icon;
          return (
            <div key={rec.id} className={cn("flex gap-3 rounded-lg border-l-4 bg-slate-50 p-3", config.borderClass)}>
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconColor)} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs", config.badgeClass)}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-slate-500">{rec.channel}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-800">{rec.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{rec.description}</p>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-slate-600">
                    <ArrowRight className="h-3 w-3" />
                    {rec.action}
                  </span>
                  <span className="text-slate-400">Стоимость: {rec.cost}</span>
                  <span className="font-medium text-green-600">{rec.expectedResult}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
