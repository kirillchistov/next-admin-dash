"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface OnboardingData {
  companyName: string;
  industry: string;
  size: string;
  goal: string;
  budget: number;
  channels: string[];
}

export type UpdateFn = (u: Partial<OnboardingData>) => void;

export const GOALS = [
  "Увеличить поток новых клиентов",
  "Снизить стоимость привлечения клиента",
  "Увеличить средний чек",
  "Повысить узнаваемость бренда",
  "Вернуть ушедших клиентов",
];

export const CHANNELS = ["Яндекс.Директ", "VK Ads", "SEO", "Telegram Ads", "Avito", "Instagram", "TikTok"];

const INDUSTRIES = [
  "Розничная торговля",
  "Рестораны и кафе",
  "Красота и здоровье",
  "Медицина",
  "Образование",
  "Строительство",
  "IT и технологии",
  "Другое",
];

const SIZES = ["1-5", "6-20", "21-50", "51-200", "200+"];
const SIZE_LABELS: Record<string, string> = {
  "1-5": "1–5 сотрудников",
  "6-20": "6–20 сотрудников",
  "21-50": "21–50 сотрудников",
  "51-200": "51–200 сотрудников",
  "200+": "Более 200",
};

type NavProps = { onNext: () => void; onBack?: () => void };

export function StepBusiness({
  data,
  onUpdate,
  onNext,
}: { data: Partial<OnboardingData>; onUpdate: UpdateFn } & NavProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>О вашем бизнесе</CardTitle>
        <CardDescription>Расскажите немного о компании</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Название компании</Label>
          <Input
            id="name"
            placeholder="Например: Атлант-Оптика"
            value={data.companyName ?? ""}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Отрасль</Label>
          <Select onValueChange={(v) => onUpdate({ industry: v })} value={data.industry}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Выберите отрасль" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Размер компании</Label>
          <Select onValueChange={(v) => onUpdate({ size: v })} value={data.size}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Сколько сотрудников?" />
            </SelectTrigger>
            <SelectContent>
              {SIZES.map((s) => (
                <SelectItem key={s} value={s}>
                  {SIZE_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onNext}
          disabled={!data.companyName || !data.industry}
        >
          Далее
        </Button>
      </CardContent>
    </Card>
  );
}

export function StepGoals({
  data,
  onUpdate,
  onNext,
  onBack,
}: { data: Partial<OnboardingData>; onUpdate: UpdateFn } & Required<NavProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ваши цели</CardTitle>
        <CardDescription>Что важнее всего для вашего бизнеса?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Основная цель</Label>
          {GOALS.map((goal) => (
            <div
              key={goal}
              onClick={() => onUpdate({ goal })}
              className={cn(
                "cursor-pointer rounded-lg border p-3 text-sm transition-colors",
                data.goal === goal
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:border-slate-300",
              )}
            >
              {goal}
            </div>
          ))}
        </div>
        <div>
          <Label>Ежемесячный рекламный бюджет</Label>
          <div className="mt-3 px-1">
            <Slider
              min={10000}
              max={500000}
              step={5000}
              value={[data.budget ?? 100000]}
              onValueChange={([v]) => onUpdate({ budget: v })}
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>10 000 ₽</span>
              <span className="font-semibold text-slate-800">{(data.budget ?? 100000).toLocaleString("ru-RU")} ₽</span>
              <span>500 000 ₽</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Назад
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onNext} disabled={!data.goal}>
            Далее
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function StepChannels({
  data,
  onUpdate,
  onNext,
  onBack,
}: { data: Partial<OnboardingData>; onUpdate: UpdateFn } & Required<NavProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Текущие рекламные каналы</CardTitle>
        <CardDescription>Отметьте каналы, которые вы уже используете</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {CHANNELS.map((ch) => {
            const checked = data.channels?.includes(ch) ?? false;
            const toggle = () => {
              const cur = data.channels ?? [];
              onUpdate({ channels: checked ? cur.filter((c) => c !== ch) : [...cur, ch] });
            };
            return (
              <div
                key={ch}
                onClick={toggle}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                  checked ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-slate-300",
                )}
              >
                <Checkbox checked={checked} onCheckedChange={() => {}} className="pointer-events-none" />
                {ch}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Назад
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onNext}>
            Далее
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function StepDone({ data, onGo }: { data: Partial<OnboardingData>; onGo: () => void }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mb-2 text-5xl">🎉</div>
        <CardTitle>Всё готово!</CardTitle>
        <CardDescription>Ваш профиль настроен. Можно начинать работу.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-lg bg-slate-50 p-4 text-left text-sm">
          <div>
            <span className="text-slate-500">Компания:</span> <strong>{data.companyName}</strong>
          </div>
          <div>
            <span className="text-slate-500">Отрасль:</span> <strong>{data.industry}</strong>
          </div>
          <div>
            <span className="text-slate-500">Бюджет:</span>{" "}
            <strong>{(data.budget ?? 0).toLocaleString("ru-RU")} ₽/мес</strong>
          </div>
          <div>
            <span className="text-slate-500">Цель:</span> <strong>{data.goal}</strong>
          </div>
          {(data.channels?.length ?? 0) > 0 && (
            <div>
              <span className="text-slate-500">Каналы:</span> <strong>{data.channels?.join(", ")}</strong>
            </div>
          )}
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onGo}>
          Перейти в дашборд
        </Button>
      </CardContent>
    </Card>
  );
}
