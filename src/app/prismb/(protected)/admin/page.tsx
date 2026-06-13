import { redirect } from "next/navigation";

import { TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminClients } from "@/data/prismb";
import { safeCookies } from "@/lib/prismb-cookies";

import { SwitchClientButton } from "./_components/switch-client-button";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: "Активен", cls: "bg-green-100 text-green-700 border-0" },
    trial: { label: "Триал", cls: "bg-blue-100 text-blue-700 border-0" },
    churned: { label: "Отток", cls: "bg-red-100 text-red-700 border-0" },
  };
  const cfg = map[status] ?? { label: status, cls: "" };
  return <Badge className={`text-xs ${cfg.cls}`}>{cfg.label}</Badge>;
}

const PLAN_LABELS: Record<string, string> = {
  demo: "Демо",
  free: "Бесплатный",
  basic: "Базовый",
  trial: "Триал",
  none: "—",
};

export default async function AdminPage() {
  const cookieStore = await safeCookies();
  const session = cookieStore?.get("prismb_session")?.value;
  if (session !== "admin" && cookieStore !== null) redirect("/prismb/dashboard");

  const totalActive = adminClients.filter((c) => c.status === "active").length;
  const totalBudget = adminClients.filter((c) => c.status === "active").reduce((s, c) => s + c.monthlyBudget, 0);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-slate-900">Клиенты</h1>
          <p className="mt-1 text-slate-500 text-sm">Управление клиентскими аккаунтами</p>
        </div>
        <Button size="sm">Добавить клиента</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Всего клиентов", value: adminClients.length, color: "text-slate-900" },
          { label: "Активных", value: totalActive, color: "text-green-600" },
          {
            label: "Суммарный бюджет/мес.",
            value: `${totalBudget.toLocaleString("ru-RU")} ₽`,
            color: "text-slate-900",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5 text-center">
              <div className={`font-bold text-3xl ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-slate-500 text-xs">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <CardTitle>Список клиентов</CardTitle>
          </div>
          <CardDescription>Все зарегистрированные компании</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  {["Компания", "Отрасль", "Статус", "Тариф", "Бюджет", "Лиды", "С даты", ""].map((h) => (
                    <th key={h} className="pr-4 pb-3 font-semibold text-slate-500 text-xs uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminClients.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-slate-800">{c.name}</div>
                      {c.churnedAgo && <div className="text-red-400 text-xs">{c.churnedAgo}</div>}
                      {c.trialDaysLeft !== undefined && (
                        <div className="text-blue-500 text-xs">{c.trialDaysLeft} дней осталось</div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{c.industry}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">{PLAN_LABELS[c.plan] ?? c.plan}</td>
                    <td className="py-3 pr-4 text-right font-mono text-slate-700">
                      {c.monthlyBudget > 0 ? `${c.monthlyBudget.toLocaleString("ru-RU")} ₽` : "—"}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      {c.leads > 0 ? (
                        <span className="flex items-center justify-end gap-1 text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          {c.leads}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">{c.since}</td>
                    <td className="py-3">
                      <SwitchClientButton clientId={c.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
