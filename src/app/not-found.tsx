"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { prismbRoutes } from "@/lib/prismb-routes";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">Страница не найдена</h1>
      <p className="text-muted-foreground">Страница, которую вы ищете, не найдена.</p>
      <Link prefetch={false} replace href={prismbRoutes.home}>
        <Button variant="outline">На главную страницу</Button>
      </Link>
    </div>
  );
}
