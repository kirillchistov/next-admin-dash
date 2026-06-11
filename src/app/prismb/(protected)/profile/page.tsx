import { cookies } from "next/headers";

import { BarChart2, Building2, Check, Target, Zap } from "lucide-react";

import type { ImportedChannelsCookie } from "@/app/api/prismb/import-csv/route";
import type { MetrikaCookie } from "@/app/api/prismb/metrika/connect/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { companyProfile } from "@/data/prismb";

import { CsvImport } from "./_components/csv-import";
import { MetrikaConnect } from "./_components/metrika-connect";

const PLANS = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0 ₽",
    period: "",
    current: true,
    color: "border-slate-200",
    badge: "Активен",
    badgeClass: "bg-green-100 text-green-700",
    features: [
      "Дашборд с основными метриками",
      "Еженедельный отчёт",
      "3 вопроса ИИшнику в месяц",
      "Базовый конкурентный анализ",
    ],
    cta: "Текущий план",
    ctaDisabled: true,
  },
  {
    id: "basic",
    name: "Базовый",
    price: "9 900 ₽",
    period: "/месяц",
    current: false,
    color: "border-blue-300 shadow-blue-100",
    badge: "Популярный",
    badgeClass: "bg-blue-100 text-blue-700",
    features: [
      "Всё из бесплатного плана",
      "Безлимитный ИИшник",
      "ROI-Медиапланер",
      "Генератор рекламных текстов",
      "Контроль подрядчика",
      "До 3 каналов аналитики",
    ],
    cta: "Попробовать 14 дней",
    ctaDisabled: false,
  },
  {
    id: "pro",
    name: "Расширенный",
    price: "24 900 ₽",
    period: "/месяц",
    current: false,
    color: "border-purple-300",
    badge: "Максимум",
    badgeClass: "bg-purple-100 text-purple-700",
    features: [
      "Всё из базового плана",
      "Все каналы без ограничений",
      "Анализ ЦА и сегментация",
      "Трекер гипотез",
      "Выделенный менеджер",
      "Приоритетная поддержка",
    ],
    cta: "Связаться с нами",
    ctaDisabled: false,
  },
];

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const metrikaRaw = cookieStore.get("prismb_metrika")?.value;
  const metrika: MetrikaCookie | null = metrikaRaw ? (JSON.parse(metrikaRaw) as MetrikaCookie) : null;
  const importedRaw = cookieStore.get("prismb_imported_channels")?.value;
  const imported: ImportedChannelsCookie | null = importedRaw
    ? (JSON.parse(importedRaw) as ImportedChannelsCookie)
    : null;
  const { name, industry, size, revenue, monthlyAdBudget, primaryGoal, targetCPA, avgOrderValue } = companyProfile;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Профиль компании</h1>
        <p className="mt-1 text-sm text-slate-500">Данные вашего бизнеса и настройки подписки</p>
      </div>

      {/* Company info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <CardTitle>О компании</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <div className="mb-0.5 text-xs text-slate-500">Название</div>
              <div className="font-semibold text-slate-800">{name}</div>
            </div>
            <div>
              <div className="mb-0.5 text-xs text-slate-500">Отрасль</div>
              <div className="font-semibold text-slate-800">{industry}</div>
            </div>
            <div>
              <div className="mb-0.5 text-xs text-slate-500">Размер компании</div>
              <div className="font-semibold text-slate-800">{size}</div>
            </div>
            <div>
              <div className="mb-0.5 text-xs text-slate-500">Годовая выручка</div>
              <div className="font-semibold text-slate-800">{revenue}</div>
            </div>
            <div>
              <div className="mb-0.5 text-xs text-slate-500">Рекламный бюджет</div>
              <div className="font-semibold text-slate-800">{monthlyAdBudget.toLocaleString("ru-RU")} ₽/мес.</div>
            </div>
            <div>
              <div className="mb-0.5 text-xs text-slate-500">Средний чек</div>
              <div className="font-semibold text-slate-800">{avgOrderValue.toLocaleString("ru-RU")} ₽</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <div>
                <span className="text-xs text-slate-500">Главная цель: </span>
                <span className="font-medium text-slate-800">{primaryGoal}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BarChart2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              <div>
                <span className="text-xs text-slate-500">Целевой CPA: </span>
                <span className="font-medium text-slate-800">≤{targetCPA.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="outline" size="sm">
              Редактировать профиль
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data connections */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <CardTitle>Источники данных</CardTitle>
          </div>
          <CardDescription>Подключённые рекламные кабинеты и системы аналитики</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Яндекс.Метрика", status: "connected", updated: "Сегодня, 09:15" },
              { name: "Яндекс.Директ", status: "connected", updated: "Сегодня, 09:15" },
              { name: "VK Ads", status: "connected", updated: "Вчера, 18:42" },
              { name: "AmoCRM", status: "disconnected", updated: null },
            ].map((src) => (
              <div key={src.name} className="flex items-center justify-between border-b py-2 last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${src.status === "connected" ? "bg-green-500" : "bg-slate-300"}`}
                  />
                  <span className="text-sm font-medium text-slate-700">{src.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {src.updated ? <span className="text-xs text-slate-400">{src.updated}</span> : null}
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    {src.status === "connected" ? "Отключить" : "Подключить"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <div id="subscription">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Подписка</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={`border-2 ${plan.color} ${plan.current ? "shadow-md" : ""}`}>
              <CardHeader className="pb-3">
                <div className="mb-1 flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <Badge className={`text-xs ${plan.badgeClass} border-0`}>{plan.badge}</Badge>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      <span className="text-slate-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : plan.id === "basic" ? "default" : "outline"}
                  disabled={plan.ctaDisabled}
                  size="sm"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          Независимый советник — мы не аффилированы ни с одной рекламной платформой
        </p>
      </div>

      {/* Integrations */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Интеграции</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Источники данных</CardTitle>
            <CardDescription>Подключите реальные данные — дашборд обновится автоматически</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetrikaConnect connected={!!metrika} counterName={metrika?.counterName} />
            <CsvImport
              imported={!!imported}
              importedAt={imported?.importedAt}
              channelCount={imported?.channels.length}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
