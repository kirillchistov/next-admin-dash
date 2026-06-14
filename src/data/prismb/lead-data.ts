export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  channel: string;
  status: LeadStatus;
  date: string;
  budget: number;
};

const FIRST_NAMES_M = ["Александр", "Андрей", "Дмитрий", "Сергей", "Иван", "Михаил", "Артём", "Николай"];
const FIRST_NAMES_F = ["Мария", "Анна", "Елена", "Ольга", "Наталья", "Татьяна", "Ирина", "Юлия"];
const LAST_INITIALS = ["А", "В", "Г", "Д", "К", "Л", "М", "Н", "П", "Р", "С", "Т"];
const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];
const PHONE_PFXS = ["985", "916", "903", "926", "999", "977", "965", "958"];
const DAYS = ["1 июн", "2 июн", "3 июн", "4 июн", "5 июн", "6 июн", "7 июн", "8 июн", "9 июн", "10 июн"];

function sr(seed: number, i: number): number {
  const x = Math.sin(seed * 127.1 + i * 311.7 + 1.0) * 43758.5453;
  return x - Math.floor(x);
}
function ri(seed: number, i: number, min: number, max: number): number {
  return min + Math.floor(sr(seed, i) * (max - min + 1));
}

export function genLeads(seed: number, count: number, channels: string[], avgOrder: number): Lead[] {
  return Array.from({ length: Math.min(count, 10) }, (_, i) => {
    const isMale = sr(seed, i * 7 + 1) > 0.5;
    const firstName = isMale
      ? FIRST_NAMES_M[ri(seed, i * 7 + 2, 0, FIRST_NAMES_M.length - 1)]
      : FIRST_NAMES_F[ri(seed, i * 7 + 3, 0, FIRST_NAMES_F.length - 1)];
    const lastInit = LAST_INITIALS[ri(seed, i * 7 + 4, 0, LAST_INITIALS.length - 1)];
    const pfx = PHONE_PFXS[ri(seed, i * 7 + 5, 0, PHONE_PFXS.length - 1)];
    const mid = String(ri(seed, i * 7 + 6, 100, 999));
    const channel = channels[ri(seed, i * 7 + 8, 0, channels.length - 1)];
    const status = STATUSES[ri(seed, i * 7 + 9, 0, STATUSES.length - 1)];
    const day = DAYS[ri(seed, i * 7 + 10, 0, DAYS.length - 1)];
    const budget = Math.round((avgOrder * (0.8 + sr(seed, i * 7 + 11) * 0.4)) / 500) * 500;
    return {
      id: i + 1,
      name: `${firstName} ${lastInit}.`,
      phone: `+7 (${pfx}) ${mid}-**`,
      channel,
      status,
      date: day,
      budget,
    };
  });
}

export const recentLeads: Lead[] = [
  {
    id: 1,
    name: "Мария К.",
    phone: "+7 (985) 123-**",
    channel: "Яндекс.Директ",
    status: "won",
    date: "9 июн",
    budget: 14500,
  },
  {
    id: 2,
    name: "Андрей В.",
    phone: "+7 (916) 456-**",
    channel: "VK Ads",
    status: "contacted",
    date: "9 июн",
    budget: 9000,
  },
  {
    id: 3,
    name: "Ольга С.",
    phone: "+7 (903) 789-**",
    channel: "SEO",
    status: "qualified",
    date: "8 июн",
    budget: 12000,
  },
  {
    id: 4,
    name: "Дмитрий П.",
    phone: "+7 (926) 321-**",
    channel: "Яндекс.Директ",
    status: "won",
    date: "8 июн",
    budget: 15500,
  },
  { id: 5, name: "Юлия М.", phone: "+7 (999) 654-**", channel: "VK Ads", status: "new", date: "7 июн", budget: 8500 },
  {
    id: 6,
    name: "Иван Н.",
    phone: "+7 (977) 987-**",
    channel: "Яндекс.Директ",
    status: "lost",
    date: "7 июн",
    budget: 11000,
  },
  { id: 7, name: "Елена Р.", phone: "+7 (965) 147-**", channel: "SEO", status: "won", date: "6 июн", budget: 13500 },
  {
    id: 8,
    name: "Сергей Д.",
    phone: "+7 (985) 258-**",
    channel: "Яндекс.Директ",
    status: "contacted",
    date: "6 июн",
    budget: 10500,
  },
  {
    id: 9,
    name: "Наталья Г.",
    phone: "+7 (916) 369-**",
    channel: "VK Ads",
    status: "qualified",
    date: "5 июн",
    budget: 9500,
  },
  {
    id: 10,
    name: "Артём К.",
    phone: "+7 (903) 741-**",
    channel: "Яндекс.Директ",
    status: "won",
    date: "5 июн",
    budget: 16000,
  },
];
