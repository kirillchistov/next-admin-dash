// PriSMB — Атлант-Оптика static mock data

export const companyProfile = {
  name: "Атлант-Оптика",
  industry: "Розничная торговля — оптика",
  size: "35 сотрудников",
  revenue: "~120 млн руб./год",
  monthlyAdBudget: 185000,
  channels: ["Яндекс.Директ", "VK Ads", "SEO"],
  primaryGoal: "Увеличить поток новых покупателей на 25% за квартал",
  targetCPA: 2000,
  avgOrderValue: 12500,
};

export const last30DaysMetrics = {
  totalSpend: 181500,
  totalLeads: 87,
  totalOrders: 62,
  revenue: 775000,
  roi: 327,
  cpa: 2086,
  cpl: 2086,
  trafficTotal: 8420,
  conversionRate: 1.73,
  topChannel: "Яндекс.Директ",
};

// 30 days of daily traffic — Mon-Fri higher, weekends lower, slight upward trend
export const dailyTrafficData = [
  { date: "11 мая", visits: 210, leads: 2 },
  { date: "12 мая", visits: 245, leads: 3 },
  { date: "13 мая", visits: 298, leads: 3 },
  { date: "14 мая", visits: 312, leads: 4 },
  { date: "15 мая", visits: 280, leads: 3 },
  { date: "16 мая", visits: 178, leads: 2 },
  { date: "17 мая", visits: 155, leads: 1 },
  { date: "18 мая", visits: 265, leads: 3 },
  { date: "19 мая", visits: 290, leads: 3 },
  { date: "20 мая", visits: 318, leads: 4 },
  { date: "21 мая", visits: 325, leads: 3 },
  { date: "22 мая", visits: 302, leads: 3 },
  { date: "23 мая", visits: 190, leads: 2 },
  { date: "24 мая", visits: 168, leads: 2 },
  { date: "25 мая", visits: 275, leads: 3 },
  { date: "26 мая", visits: 305, leads: 4 },
  { date: "27 мая", visits: 330, leads: 4 },
  { date: "28 мая", visits: 345, leads: 4 },
  { date: "29 мая", visits: 315, leads: 3 },
  { date: "30 мая", visits: 195, leads: 2 },
  { date: "31 мая", visits: 172, leads: 2 },
  { date: "1 июн", visits: 285, leads: 3 },
  { date: "2 июн", visits: 320, leads: 4 },
  { date: "3 июн", visits: 350, leads: 4 },
  { date: "4 июн", visits: 365, leads: 4 },
  { date: "5 июн", visits: 335, leads: 4 },
  { date: "6 июн", visits: 210, leads: 2 },
  { date: "7 июн", visits: 185, leads: 2 },
  { date: "8 июн", visits: 340, leads: 4 },
  { date: "9 июн", visits: 358, leads: 5 },
];

export const channelBreakdown = [
  { name: "Яндекс.Директ", spend: 115000, clicks: 4200, leads: 54, cpa: 2130, cpl: 2130, color: "#f59e0b" },
  { name: "VK Ads", spend: 47000, clicks: 2800, leads: 21, cpa: 2238, cpl: 2238, color: "#3b82f6" },
  { name: "SEO", spend: 19500, clicks: 1420, leads: 12, cpa: 1625, cpl: 1625, color: "#10b981" },
];

export const competitors = [
  { name: "Линзмастер", visibility: 72, strongIn: "VK", trend: "stable" },
  { name: "ОчкоПлюс", visibility: 68, strongIn: "Директ", trend: "up" },
  { name: "Атлант-Оптика", visibility: 54, strongIn: "Директ", trend: "up", isSelf: true },
  { name: "ЭОС Оптика", visibility: 45, strongIn: "SEO", trend: "down" },
];

export const recommendations = [
  {
    id: 1,
    severity: "red" as const,
    channel: "Яндекс.Директ",
    title: "Ставки по запросу «купить очки для зрения» упали",
    description: "Конкуренты обходят вас по ключевому запросу. Рекомендую поднять ставку на 15%.",
    action: "Поднять ставку на 15%",
    cost: "~12 400 ₽",
    expectedResult: "+8 лидов/мес.",
  },
  {
    id: 2,
    severity: "yellow" as const,
    channel: "VK Ads",
    title: "CTR объявлений упал на 23% за 2 недели",
    description: "Креативы устарели — аудитория перестала реагировать. Нужно обновить 3 объявления.",
    action: "Обновить 3 объявления",
    cost: "Время дизайнера",
    expectedResult: "CTR вернётся к норме, +5 лидов/мес.",
  },
  {
    id: 3,
    severity: "green" as const,
    channel: "SEO",
    title: "Позиция по «оправы для очков Москва» выросла с 12 до 7",
    description: "Хороший сигнал — стоит закрепить успех и занять топ-5.",
    action: "Добавить 2 статьи на сайт",
    cost: "Бесплатно",
    expectedResult: "Топ-5, +4 лидов/мес.",
  },
];

export type TopPage = { path: string; title: string; views: number; leads: number; convRate: number };

export const topPages: TopPage[] = [
  { path: "/catalog/linzy", title: "Контактные линзы", views: 2840, leads: 18, convRate: 0.63 },
  { path: "/catalog/opravy", title: "Оправы для очков", views: 2210, leads: 14, convRate: 0.63 },
  { path: "/", title: "Главная страница", views: 1870, leads: 9, convRate: 0.48 },
  { path: "/promo/leto-2025", title: "Акция: Лето-2025", views: 1240, leads: 11, convRate: 0.89 },
  { path: "/solntsezash", title: "Солнцезащитные очки", views: 980, leads: 7, convRate: 0.71 },
  { path: "/kontakty", title: "Контакты и адреса", views: 820, leads: 4, convRate: 0.49 },
];

export const hypotheses = [
  {
    id: 1,
    text: "Целевая аудитория старше 45 лет плохо конвертируется через VK — возможно, стоит перенаправить бюджет в Яндекс",
    status: "new" as const,
  },
  { id: 2, text: "Промо-акция «2-е очки в подарок» может повысить средний чек на 30%", status: "new" as const },
  { id: 3, text: "Реклама в субботу дороже и хуже конвертируется — стоит отключить", status: "new" as const },
];

export const mediaPlannerChannels = [
  {
    name: "Яндекс.Директ",
    cplMin: 1800,
    cplMax: 2500,
    ctrMin: 3,
    ctrMax: 6,
    bestFor: "горячий спрос",
    defaultShare: 62,
  },
  {
    name: "VK Ads",
    cplMin: 2100,
    cplMax: 3200,
    ctrMin: 0.8,
    ctrMax: 1.5,
    bestFor: "широкая аудитория, ретаргет",
    defaultShare: 26,
  },
  {
    name: "Telegram Ads",
    cplMin: 3500,
    cplMax: 5000,
    ctrMin: 0.3,
    ctrMax: 0.7,
    bestFor: "лояльная аудитория",
    defaultShare: 0,
  },
  { name: "SEO", cplMin: 1200, cplMax: 1800, ctrMin: 2, ctrMax: 5, bestFor: "долгосрочный трафик", defaultShare: 11 },
  {
    name: "AEO",
    cplMin: 1500,
    cplMax: 2200,
    ctrMin: 1,
    ctrMax: 3,
    bestFor: "выдача в ИИ-поиске (Яндекс Нейро, ChatGPT, Perplexity)",
    defaultShare: 0,
    isNew: true,
    tooltip:
      "Answer Engine Optimization — оптимизация под ответы ИИ-поисковиков. Помогает попасть в прямые ответы Яндекс Нейро, ChatGPT и Perplexity. Эффект накопительный, как SEO, но быстрее при правильной структуре контента.",
  },
  { name: "Avito", cplMin: 900, cplMax: 1400, ctrMin: 2, ctrMax: 4, bestFor: "готовые покупатели", defaultShare: 0 },
];
