// PriSMB — per-client deterministic data generation

import { adminClients, weeklyReportData } from "./admin-data";
import { companyProfile, last30DaysMetrics, dailyTrafficData, channelBreakdown, recommendations } from "./mock-data";

// ── Types ──────────────────────────────────────────────────────────────────────
export type DailyPoint = { date: string; visits: number; leads: number };
export type ChannelItem = {
  name: string;
  spend: number;
  clicks: number;
  leads: number;
  cpa: number;
  cpl: number;
  color: string;
};
export type Rec = {
  id: number;
  severity: "red" | "yellow" | "green";
  channel: string;
  title: string;
  description: string;
  action: string;
  cost: string;
  expectedResult: string;
};
export type WeeklyReport = { days: DailyPoint[]; summary: string[]; actions: string[] };
export type CompanyProfileType = typeof companyProfile;
export type Last30DaysType = typeof last30DaysMetrics;
export type ClientData = {
  companyProfile: CompanyProfileType;
  last30DaysMetrics: Last30DaysType;
  dailyTrafficData: DailyPoint[];
  channelBreakdown: ChannelItem[];
  recommendations: Rec[];
  weeklyReportData: WeeklyReport;
};

// ── Deterministic RNG ──────────────────────────────────────────────────────────
function srand(seed: number, idx: number): number {
  const x = Math.sin(seed * 127.1 + idx * 311.7 + 1.0) * 43758.5453;
  return x - Math.floor(x);
}
function ri(seed: number, idx: number, min: number, max: number): number {
  return min + Math.floor(srand(seed, idx) * (max - min + 1));
}

// ── Label helpers ──────────────────────────────────────────────────────────────
function sizeLabel(budget: number): string {
  if (budget >= 250000) return "50–100 сотрудников";
  if (budget >= 120000) return "20–50 сотрудников";
  if (budget >= 60000) return "10–20 сотрудников";
  return "до 10 сотрудников";
}
function revenueLabel(budget: number, seed: number): string {
  const annual = budget * ri(seed, 98, 35, 65);
  return `~${Math.round(annual / 1_000_000)} млн руб./год`;
}

const GOALS: Record<string, string> = {
  "Фильтры для воды / Ecom": "Вырасти в онлайн-продажах на 30% за квартал",
  "Логистика / Доставка грузов": "Привлечь 50 новых корпоративных клиентов",
  "Продакшен / Видео": "Получить 20 заявок на производство видео в месяц",
  "HR Tech / SaaS": "Снизить CAC до 2 500 ₽ и вырасти до 200 подписчиков",
  "Электротранспорт / Аренда": "Загрузить парк на 80% и расширить флот",
  Рестораны: "Увеличить поток гостей на 20% через digital",
  "Фитнес / Питание": "Набрать 150 постоянных клиентов за 3 месяца",
  Оптика: "Увеличить поток новых покупателей на 25% за квартал",
};
function primaryGoal(industry: string): string {
  return GOALS[industry] ?? "Увеличить продажи и снизить стоимость привлечения";
}

// ── Recommendation pools ───────────────────────────────────────────────────────
type RecTemplate = Omit<Rec, "id">;
const RED_RECS: RecTemplate[] = [
  {
    severity: "red",
    channel: "Яндекс.Директ",
    title: "Ставки по ключевым запросам упали",
    description: "Конкуренты перебивают вас по главным запросам. Доля показов снизилась на 18%.",
    action: "Поднять ставки на 15%",
    cost: "~15 000 ₽",
    expectedResult: "+9 лидов/мес.",
  },
  {
    severity: "red",
    channel: "VK Ads",
    title: "CTR объявлений упал на 27%",
    description: "Креативы устарели — аудитория перестала реагировать.",
    action: "Обновить креативы",
    cost: "Время дизайнера",
    expectedResult: "CTR вернётся к норме",
  },
  {
    severity: "red",
    channel: "Сайт",
    title: "Конверсия посадочной страницы упала",
    description: "Конверсия снизилась с 2.1% до 1.4% — возможна проблема с формой.",
    action: "Проверить форму заявки",
    cost: "Бесплатно",
    expectedResult: "+6 лидов/мес.",
  },
];
const YELLOW_RECS: RecTemplate[] = [
  {
    severity: "yellow",
    channel: "VK Ads",
    title: "Частота показа объявлений растёт",
    description: "Средняя частота 4.8 показа — аудитория выгорает.",
    action: "Расширить аудиторию на look-alike",
    cost: "0 ₽",
    expectedResult: "+4 лидов/мес.",
  },
  {
    severity: "yellow",
    channel: "Яндекс.Директ",
    title: "Высокий процент отказов по одному объявлению",
    description: "Объявление «Акция июня» даёт 68% отказов — несоответствие.",
    action: "Исправить посадочную страницу",
    cost: "Бесплатно",
    expectedResult: "Снижение CPA на 12%",
  },
  {
    severity: "yellow",
    channel: "SEO",
    title: "Технические ошибки замедляют индексацию",
    description: "Crawler находит 14 страниц с ошибкой 404.",
    action: "Исправить 404 ошибки",
    cost: "Бесплатно",
    expectedResult: "Ускорение индексации",
  },
];
const GREEN_RECS: RecTemplate[] = [
  {
    severity: "green",
    channel: "SEO",
    title: "Позиции по брендовым запросам растут",
    description: "За месяц поднялись с 14 до 8 по 3 фразам — стоит закрепить.",
    action: "Добавить 2 статьи в блог",
    cost: "Бесплатно",
    expectedResult: "+5 лидов/мес.",
  },
  {
    severity: "green",
    channel: "Avito",
    title: "Avito даёт дешёвые лиды в вашей нише",
    description: "Конкуренты слабо представлены — CPL на 30% ниже Директа.",
    action: "Запустить тест за 20 000 ₽",
    cost: "20 000 ₽",
    expectedResult: "CPL ~1 200 ₽",
  },
  {
    severity: "green",
    channel: "Ретаргетинг",
    title: "Большая аудитория не конвертировалась",
    description: "За месяц 8 000+ посетителей — 85% не оставили заявку.",
    action: "Запустить ретаргетинг-кампанию",
    cost: "25 000 ₽/мес.",
    expectedResult: "+12 лидов/мес.",
  },
];

function genRecommendations(seed: number): Rec[] {
  return [
    { id: 1, ...RED_RECS[ri(seed, 71, 0, RED_RECS.length - 1)] },
    { id: 2, ...YELLOW_RECS[ri(seed, 72, 0, YELLOW_RECS.length - 1)] },
    { id: 3, ...GREEN_RECS[ri(seed, 73, 0, GREEN_RECS.length - 1)] },
  ];
}

// ── Weekly report text pools ───────────────────────────────────────────────────
const WEEKLY_SUMMARIES: string[][] = [
  [
    "Трафик вырос на 8% — положительный тренд.",
    "CTR в Директе снизился с 4.2% до 3.7% — стоит проверить ставки.",
    "SEO: 2 запроса поднялись в топ-10.",
  ],
  [
    "Лиды выше плана на 11% — каналы в норме.",
    "Стоимость клика в VK выросла на 12% — конкуренция усилилась.",
    "Ретаргетинг: конверсия 3.1% — лучший результат за месяц.",
  ],
  [
    "Конверсия сайта снизилась с 2.1% до 1.8% — требует внимания.",
    "Директ даёт на 15% больше лидов при том же бюджете.",
    "Бренд-запросы в поиске выросли на 22%.",
  ],
];
const WEEKLY_ACTIONS: string[][] = [
  [
    "Проверить ставки в Директе, поднять по 3 ключам на 10–15%.",
    "Добавить 1 новый креатив в VK Ads.",
    "Исправить 404-ошибки на сайте.",
  ],
  [
    "Запустить A/B тест заголовка на посадочной.",
    "Увеличить бюджет Директа на 15% в пятницу и субботу.",
    "Написать 1 SEO-статью по высокочастотному запросу.",
  ],
  ["Настроить ретаргетинг на не-конвертировавшихся.", "Обновить UTM-метки в VK.", "Тест Avito с бюджетом 20 000 ₽."],
];

function genWeeklyReport(days: DailyPoint[], seed: number): WeeklyReport {
  return {
    days,
    summary: WEEKLY_SUMMARIES[ri(seed, 81, 0, WEEKLY_SUMMARIES.length - 1)],
    actions: WEEKLY_ACTIONS[ri(seed, 82, 0, WEEKLY_ACTIONS.length - 1)],
  };
}

// ── Main function ──────────────────────────────────────────────────────────────
export function getClientData(rawId: number | string | undefined): ClientData {
  const clientId = Number(rawId) || 1;
  const baseData = {
    companyProfile,
    last30DaysMetrics,
    dailyTrafficData,
    channelBreakdown,
    recommendations,
    weeklyReportData,
  };

  if (clientId === 1) return baseData;

  const client = adminClients.find((c) => c.id === clientId);
  if (!client || client.id === 1) return baseData;

  const s = clientId;
  const budget = client.monthlyBudget;
  const leads = client.leads;

  const avgOrder = ri(s, 1, 6000, 28000);
  const orders = Math.max(1, Math.round(leads * (0.5 + srand(s, 2) * 0.3)));
  const revenue = orders * avgOrder;
  const totalSpend = Math.round(budget * (0.91 + srand(s, 3) * 0.09));
  const cpa = leads > 0 ? Math.round(totalSpend / leads) : 2500;
  const trafficTotal = ri(s, 5, 2000, 12000);

  const sh1 = 0.48 + srand(s, 10) * 0.22;
  const sh2 = 0.2 + srand(s, 11) * 0.15;
  const sh3 = Math.max(0.05, 1 - sh1 - sh2);
  const mkChannel = (name: string, color: string, sh: number, clickIdx: number): ChannelItem => {
    const spend = Math.round(totalSpend * sh);
    const chLeads = Math.round(leads * sh);
    const chCpa = chLeads > 0 ? Math.round(spend / chLeads) : 0;
    return { name, spend, clicks: ri(s, clickIdx, 400, 5500), leads: chLeads, cpa: chCpa, cpl: chCpa, color };
  };
  const channelBreakdownGenerated: ChannelItem[] = [
    mkChannel("Яндекс.Директ", "#f59e0b", sh1, 12),
    mkChannel("VK Ads", "#3b82f6", sh2, 13),
    mkChannel("SEO", "#10b981", sh3, 14),
  ];

  const visitsScale = trafficTotal / 8420;
  const leadsScale = leads > 0 ? leads / 87 : 1;
  const dailyTrafficGenerated: DailyPoint[] = dailyTrafficData.map((d, i) => ({
    date: d.date,
    visits: Math.max(10, Math.round(d.visits * visitsScale * (0.88 + srand(s, i + 20) * 0.24))),
    leads: Math.max(0, Math.round(d.leads * leadsScale * (0.75 + srand(s, i + 50) * 0.5))),
  }));

  return {
    companyProfile: {
      name: client.name,
      industry: client.industry,
      size: sizeLabel(budget),
      revenue: revenueLabel(budget, s),
      monthlyAdBudget: budget,
      channels: ["Яндекс.Директ", "VK Ads", "SEO"],
      primaryGoal: primaryGoal(client.industry),
      targetCPA: Math.round(cpa * (0.8 + srand(s, 4) * 0.15)),
      avgOrderValue: avgOrder,
    },
    last30DaysMetrics: {
      totalSpend,
      totalLeads: leads,
      totalOrders: orders,
      revenue,
      roi: totalSpend > 0 ? Math.round((revenue / totalSpend) * 100) : 0,
      cpa,
      cpl: cpa,
      trafficTotal,
      conversionRate: leads > 0 ? Math.round((leads / trafficTotal) * 10000) / 100 : 0,
      topChannel: "Яндекс.Директ",
    },
    dailyTrafficData: dailyTrafficGenerated,
    channelBreakdown: channelBreakdownGenerated,
    recommendations: genRecommendations(s),
    weeklyReportData: genWeeklyReport(dailyTrafficGenerated.slice(-7), s),
  };
}
