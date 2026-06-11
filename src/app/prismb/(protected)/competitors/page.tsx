"use client";

import { useState } from "react";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { competitors } from "@/data/prismb";
import { cn } from "@/lib/utils";

const trendIcon = (trend: string) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-slate-400" />;
};

export default function CompetitorsPage() {
  const [showQuiz, setShowQuiz] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({ q1: "", q2: "", q3: "" });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Конкурентный анализ</h1>
        <p className="mt-1 text-sm text-slate-500">Узнайте, как вы выглядите на фоне конкурентов</p>
      </div>

      {/* Quick quiz */}
      {showQuiz && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Помогите улучшить анализ</CardTitle>
            <CardDescription>3 быстрых вопроса о конкурентах</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">1. Кого вы считаете главным конкурентом?</Label>
              <Input
                placeholder="Название компании"
                value={quizAnswers.q1}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, q1: e.target.value })}
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label className="text-sm">2. В каком канале конкуренты сильнее вас?</Label>
              <Input
                placeholder="Яндекс.Директ, VK, SEO..."
                value={quizAnswers.q2}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, q2: e.target.value })}
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label className="text-sm">3. Какую акцию/предложение чаще всего показывают конкуренты?</Label>
              <Input
                placeholder="Скидки, бесплатная доставка..."
                value={quizAnswers.q3}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, q3: e.target.value })}
                className="mt-1 bg-white"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowQuiz(false)}>
              Сохранить и продолжить
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Visibility table */}
      <Card>
        <CardHeader>
          <CardTitle>Видимость в поиске</CardTitle>
          <CardDescription>Доля показов объявлений по целевым запросам</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...competitors]
              .sort((a, b) => b.visibility - a.visibility)
              .map((comp) => (
                <div
                  key={comp.name}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-3",
                    comp.isSelf ? "border border-blue-200 bg-blue-50" : "bg-slate-50",
                  )}
                >
                  <div className="w-32 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className={cn("text-sm font-medium", comp.isSelf ? "text-blue-700" : "text-slate-700")}>
                        {comp.name}
                      </span>
                      {comp.isSelf && <Badge className="bg-blue-600 text-xs text-white">Вы</Badge>}
                    </div>
                    <div className="text-xs text-slate-400">Сильнее: {comp.strongIn}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            comp.isSelf ? "bg-blue-500" : "bg-slate-400",
                          )}
                          style={{ width: `${comp.visibility}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "w-10 text-right text-sm font-bold",
                          comp.isSelf ? "text-blue-700" : "text-slate-700",
                        )}
                      >
                        {comp.visibility}%
                      </span>
                      {trendIcon(comp.trend)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            * Данные обновляются еженедельно. Источник: анализ поисковой выдачи по 120+ целевым запросам
          </p>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Что делают конкуренты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 rounded-r-lg border-l-4 border-red-400 bg-red-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">ОчкоПлюс агрессивно повышает ставки</p>
              <p className="mt-0.5 text-xs text-slate-500">
                В Яндекс.Директ они перебили вас по 5 ключевым запросам. Ответ: поднять ставку на 15%.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Линзмастер запустил акцию «Вторые очки бесплатно»</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Активна в VK последние 3 недели. Возможно, это влияет на конверсию ваших объявлений.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-r-lg border-l-4 border-green-400 bg-green-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">ЭОС Оптика теряет позиции в SEO</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Хороший момент занять их место — добавьте 2-3 материала на сайт по их бывшим запросам.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
