import { BarChart2, Check, MessageSquare, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PLANS = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0 ₽",
    period: "",
    badge: "Старт",
    badgeClass: "bg-slate-100 text-slate-600",
    color: "border-slate-200",
    features: ["Дашборд с основными метриками", "Еженедельный отчёт", "3 вопроса ИИшнику в месяц"],
    cta: "Попробовать бесплатно",
    ctaVariant: "outline" as const,
    href: "/api/prismb/demo-login",
  },
  {
    id: "basic",
    name: "Базовый",
    price: "9 900 ₽",
    period: "/месяц",
    badge: "Популярный",
    badgeClass: "bg-blue-100 text-blue-700",
    color: "border-blue-400 shadow-lg shadow-blue-100",
    features: [
      "Всё из бесплатного",
      "Безлимитный ИИшник",
      "ROI-медиапланер",
      "Генератор рекламных текстов",
      "Контроль подрядчика",
    ],
    cta: "Попробовать 14 дней",
    ctaVariant: "default" as const,
    href: "/api/prismb/demo-login",
  },
  {
    id: "pro",
    name: "Расширенный",
    price: "24 900 ₽",
    period: "/месяц",
    badge: "Максимум",
    badgeClass: "bg-purple-100 text-purple-700",
    color: "border-purple-300",
    features: [
      "Всё из базового",
      "Все каналы без ограничений",
      "Анализ ЦА и сегментация",
      "Трекер гипотез",
      "Выделенный менеджер",
    ],
    cta: "Связаться с нами",
    ctaVariant: "outline" as const,
    href: "/prismb/login",
  },
];

const PROBLEMS = [
  {
    q: "Деньги уходят — результата не видно",
    a: "Дашборд показывает стоимость лида по каждому каналу в реальном времени.",
  },
  {
    q: "Подрядчик присылает красивые отчёты",
    a: "Сравниваем его цифры с данными Метрики. Расхождения видны сразу.",
  },
  {
    q: "Нанять маркетолога — дорого",
    a: "PriSMB даёт экспертизу за фиксированную сумму без оклада и налогов.",
  },
];

const FEATURES = [
  {
    icon: BarChart2,
    title: "Живые цифры",
    desc: "Трафик, лиды, CPA — по каждому каналу. Подключите Метрику или загрузите CSV из Директа.",
  },
  {
    icon: MessageSquare,
    title: "ИИ-советник",
    desc: "Задайте вопрос про бюджет, канал или кампанию — получите конкретный ответ, не воду.",
  },
  {
    icon: ShieldCheck,
    title: "Независимость",
    desc: "Мы не продаём рекламу и не аффилированы с платформами. Советуем в ваших интересах.",
  },
];

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white px-4 py-20 text-center">
      <div className="mx-auto max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          Независимый советник по рекламе для МСБ
        </span>
        <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          Управляйте рекламой без маркетолога в штате
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          PriSMB следит за вашими каналами, считает ROI и говорит прямо — где деньги работают, а где сливаются впустую.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="px-8">
            <a href="/api/prismb/demo-login">Попробовать демо</a>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <a href="/prismb/login">Войти</a>
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-400">Демо работает без регистрации — посмотрите, как это выглядит</p>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">Знакомо?</h2>
        <p className="mb-10 text-center text-slate-500">Типичные боли владельца бизнеса без маркетолога</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div key={p.q} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-2 text-sm font-semibold text-slate-800">{p.q}</div>
              <div className="text-sm text-blue-600">{p.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">Что умеет PriSMB</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <f.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="font-semibold text-slate-800">{f.title}</div>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">Тарифы</h2>
        <p className="mb-10 text-center text-slate-500">
          Начните бесплатно — перейдите на платный, когда увидите результат
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={`border-2 ${plan.color}`}>
              <CardHeader className="pb-3">
                <div className="mb-1 flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <Badge className={`border-0 text-xs ${plan.badgeClass}`}>{plan.badge}</Badge>
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
                <Button asChild className="w-full" variant={plan.ctaVariant} size="sm">
                  <a href={plan.href}>{plan.cta}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Независимый советник — мы не аффилированы ни с одной рекламной платформой
        </p>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="border-t border-slate-100 px-4 py-8 text-center">
      <p className="text-sm font-semibold text-slate-700">PriSMB</p>
      <p className="mt-1 text-xs text-slate-400">Маркетинговый советник для малого и среднего бизнеса</p>
      <div className="mt-3 flex justify-center gap-4 text-xs text-slate-400">
        <a href="/prismb/login" className="hover:text-slate-600">
          Войти
        </a>
        <a href="/api/prismb/demo-login" className="hover:text-slate-600">
          Демо
        </a>
      </div>
    </footer>
  );
}
