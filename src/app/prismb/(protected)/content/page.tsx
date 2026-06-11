"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Check, Wand2, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CHANNELS = ["Яндекс.Директ", "VK Ads", "Telegram Ads", "Instagram", "Avito"];

const schema = z.object({
  product: z.string().min(5, "Опишите продукт подробнее"),
  audience: z.string().min(3, "Укажите целевую аудиторию"),
  channel: z.string().min(1, "Выберите канал"),
  usp: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AdVariant {
  tone: string;
  toneLabel: string;
  headline: string;
  body: string;
  cta: string;
}

function generateVariants(values: FormValues): AdVariant[] {
  const { product, audience, channel, usp } = values;
  const uspPart = usp ? ` ${usp}.` : "";
  const isShort = channel === "Яндекс.Директ";
  const isVK = channel === "VK Ads";

  return [
    {
      tone: "informative",
      toneLabel: "Информативный",
      headline: isShort ? `${product} — выгодно и быстро` : `Лучший выбор для ${audience}`,
      body: isShort
        ? `Широкий ассортимент, опытные специалисты.${uspPart} Подберём идеальный вариант.`
        : `Ищете ${product.toLowerCase()}? Мы работаем с ${audience.toLowerCase()} уже 10 лет.${uspPart} Бесплатная консультация — запишитесь сегодня.`,
      cta: "Узнать подробнее →",
    },
    {
      tone: "emotional",
      toneLabel: "Эмоциональный",
      headline: isShort ? `Видите мир ярче с нами!` : `Жизнь становится лучше, когда вы видите чётко`,
      body: isShort
        ? `${product} с заботой о вашем комфорте.${uspPart} Тысячи довольных клиентов!`
        : `${audience} — вы заслуживаете лучшего!${uspPart} Подберите ${product.toLowerCase()}, которое изменит ваши дни. Приходите — мы ждём.`,
      cta: isVK ? "Записаться сейчас 🎯" : "Попробовать →",
    },
    {
      tone: "provocative",
      toneLabel: "Провокационный",
      headline: isShort ? `Переплачиваете за очки?` : `Стоп. Вы точно покупаете это правильно?`,
      body: isShort
        ? `Сравните цены — у нас ${product.toLowerCase()} дешевле.${uspPart} Убедитесь сами!`
        : `Большинство ${audience.toLowerCase()} переплачивают за ${product.toLowerCase()} в 1.5 раза.${uspPart} Мы покажем как сделать это умнее — бесплатно.`,
      cta: "Сравнить цены →",
    },
  ];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button onClick={copy} className="text-slate-400 transition-colors hover:text-slate-600" title="Копировать">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export default function ContentPage() {
  const [variants, setVariants] = useState<AdVariant[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { product: "", audience: "", channel: "", usp: "" },
  });

  function onSubmit(values: FormValues) {
    setIsGenerating(true);
    setTimeout(() => {
      setVariants(generateVariants(values));
      setIsGenerating(false);
    }, 800);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Генератор рекламных текстов</h1>
        <p className="mt-1 text-sm text-slate-500">Получите 3 варианта объявления за 30 секунд</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Расскажите о вашем предложении</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Что рекламируем?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Например: Очки для зрения с линзами любой диоптрии, оправы от 1500 ₽"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Кому показываем?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Например: Люди 35-60 лет в Москве, с проблемами зрения"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Канал</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите канал" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CHANNELS.map((ch) => (
                            <SelectItem key={ch} value={ch}>
                              {ch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>УТП (необязательно)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Диагностика зрения бесплатно" rows={1} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Генерируем...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Создать 3 варианта
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {variants && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Варианты объявлений</h2>
          {variants.map((v) => (
            <Card key={v.tone}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{v.toneLabel}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {v.tone === "informative" ? "🔵" : v.tone === "emotional" ? "🟣" : "🔴"}
                  </Badge>
                </div>
                <CopyButton text={`${v.headline}\n\n${v.body}\n\n${v.cta}`} />
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-xs text-slate-400">Заголовок</Label>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{v.headline}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Текст</Label>
                  <p className="mt-0.5 text-sm text-slate-700">{v.body}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-400">CTA</Label>
                  <p className="mt-0.5 text-sm font-medium text-blue-600">{v.cta}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
