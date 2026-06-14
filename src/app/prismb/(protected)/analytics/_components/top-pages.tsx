import Link from "next/link";

import { PlugZap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TopPage } from "@/data/prismb";
import { cn } from "@/lib/utils";

interface Props {
  pages: TopPage[] | null;
}

export function TopPages({ pages }: Props) {
  if (!pages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Топ страниц</CardTitle>
          <CardDescription>Подключите Яндекс.Метрику для просмотра статистики</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <PlugZap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-medium text-slate-800">Данные недоступны</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Подключите счётчик Метрики, чтобы видеть топ страниц, время на сайте и источники трафика в реальном
                времени.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/prismb/profile#metrika">Подключить Метрику</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxViews = Math.max(...pages.map((p) => p.views), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ страниц</CardTitle>
        <CardDescription>По просмотрам за 30 дней</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Страница</TableHead>
              <TableHead className="text-right">Просмотры</TableHead>
              <TableHead className="text-right">Лиды</TableHead>
              <TableHead className="text-right">Конверсия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.path}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{page.title}</div>
                    <div className="font-mono text-xs text-muted-foreground">{page.path}</div>
                    <div className="h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-blue-400"
                        style={{ width: `${(page.views / maxViews) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums text-sm">{page.views.toLocaleString("ru-RU")}</TableCell>
                <TableCell className="text-right tabular-nums text-sm">{page.leads}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      page.convRate >= 0.7
                        ? "border-green-200 bg-green-50 text-green-700"
                        : page.convRate >= 0.5
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                          : "border-slate-200 bg-slate-50 text-slate-600",
                    )}
                  >
                    {page.convRate}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
