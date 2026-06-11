import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChannelItem } from "@/data/prismb";

function formatRub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

interface Props {
  channelBreakdown: ChannelItem[];
  targetCPA: number;
  totalSpend: number;
}

export function AlertsPanel({ channelBreakdown, targetCPA, totalSpend }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Каналы</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {channelBreakdown.map((ch) => {
          const cpaStatus = ch.cpa <= targetCPA ? "green" : ch.cpa <= targetCPA * 1.15 ? "yellow" : "red";
          const spendBase = totalSpend > 0 ? totalSpend : 1;
          return (
            <div key={ch.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{ch.name}</span>
                <span className="text-xs text-slate-500">
                  {formatRub(ch.spend)} · {ch.leads} лидов
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((ch.spend / spendBase) * 100))}%`,
                      backgroundColor: ch.color,
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    cpaStatus === "green"
                      ? "text-green-600"
                      : cpaStatus === "yellow"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  CPA {formatRub(ch.cpa)}
                </span>
              </div>
            </div>
          );
        })}
        <div className="border-t pt-2 text-xs text-slate-400">Цель CPA: ≤{formatRub(targetCPA)}</div>
      </CardContent>
    </Card>
  );
}
