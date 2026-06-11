"use client";

import { useState } from "react";

import { Lock, Unlock, Star, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mediaPlannerChannels } from "@/data/prismb";
import { cn } from "@/lib/utils";

function formatRub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

type Projection = {
  name: string;
  share: number;
  locked: boolean;
  spend: number;
  leads: number;
  revenue: number;
  cpl: number;
  bestFor: string;
  cplMin: number;
  cplMax: number;
  isNew: boolean;
  tooltip: string | null;
};

function ChannelCard({
  proj,
  isBest,
  onChangeShare,
  onToggleLock,
}: {
  proj: Projection;
  isBest: boolean;
  onChangeShare: (v: number) => void;
  onToggleLock: () => void;
}) {
  return (
    <Card className={cn(isBest ? "ring-2 ring-blue-500" : "")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{proj.name}</CardTitle>
            {proj.isNew && <Badge className="border-purple-200 bg-purple-100 text-xs text-purple-700">Новый</Badge>}
            {isBest && (
              <Badge className="flex items-center gap-1 bg-blue-600 text-xs text-white">
                <Star className="h-3 w-3" /> ROI-чемпион
              </Badge>
            )}
            {proj.tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 cursor-help text-slate-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">{proj.tooltip}</TooltipContent>
              </Tooltip>
            )}
          </div>
          <button
            onClick={onToggleLock}
            className={cn("rounded p-1 text-xs", proj.locked ? "text-blue-600" : "text-slate-300 hover:text-slate-500")}
            title={proj.locked ? "Разблокировать" : "Зафиксировать"}
          >
            {proj.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>
        </div>
        <CardDescription className="text-xs">Лучше всего: {proj.bestFor}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>Доля бюджета</span>
            <span className="font-semibold text-slate-800">
              {proj.share}% · {formatRub(proj.spend)}
            </span>
          </div>
          <Slider
            min={0}
            max={100}
            value={[proj.share]}
            onValueChange={([v]) => onChangeShare(v)}
            disabled={proj.locked}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded bg-slate-50 p-2">
            <div className="font-bold text-slate-900">{proj.leads}</div>
            <div className="text-slate-500">лидов</div>
          </div>
          <div className="rounded bg-slate-50 p-2">
            <div className="font-bold text-slate-900">{formatRub(proj.cpl)}</div>
            <div className="text-slate-500">CPL (ср.)</div>
          </div>
          <div className="rounded bg-slate-50 p-2">
            <div className="font-bold text-green-700">{formatRub(proj.revenue)}</div>
            <div className="text-slate-500">выручка</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          CPL диапазон: {formatRub(proj.cplMin)} – {formatRub(proj.cplMax)}
        </div>
      </CardContent>
    </Card>
  );
}

interface ChannelAllocation {
  name: string;
  share: number;
  locked: boolean;
}

export default function PlannerPage() {
  const [totalBudget, setTotalBudget] = useState(185000);
  const [allocations, setAllocations] = useState<ChannelAllocation[]>(
    mediaPlannerChannels.map((ch) => ({
      name: ch.name,
      share: ch.defaultShare,
      locked: false,
    })),
  );

  function updateShare(idx: number, newShare: number) {
    const locked = allocations.filter((_, i) => i !== idx && allocations[i].locked);
    const lockedTotal = locked.reduce((sum, a) => sum + a.share, 0);
    const maxShare = 100 - lockedTotal;
    const clamped = Math.min(Math.max(newShare, 0), maxShare);
    const remaining = maxShare - clamped;
    const unlocked = allocations.filter((_, i) => i !== idx && !allocations[i].locked);
    const unlockTotal = unlocked.reduce((sum, a) => sum + a.share, 0);

    setAllocations((prev) =>
      prev.map((a, i) => {
        if (i === idx) return { ...a, share: clamped };
        if (a.locked) return a;
        if (unlockTotal === 0) return { ...a, share: remaining / unlocked.length };
        return { ...a, share: Math.round((a.share / unlockTotal) * remaining) };
      }),
    );
  }

  function toggleLock(idx: number) {
    setAllocations((prev) => prev.map((a, i) => (i === idx ? { ...a, locked: !a.locked } : a)));
  }

  const totalShare = allocations.reduce((s, a) => s + a.share, 0);

  // Projections
  const projections = allocations.map((alloc) => {
    const ch = mediaPlannerChannels.find((c) => c.name === alloc.name)!;
    const spend = Math.round((totalBudget * alloc.share) / 100);
    const avgCpl = (ch.cplMin + ch.cplMax) / 2;
    const leads = avgCpl > 0 ? Math.round(spend / avgCpl) : 0;
    const revenue = leads * 12500 * 0.7;
    return {
      ...alloc,
      spend,
      leads,
      revenue,
      cpl: avgCpl,
      bestFor: ch.bestFor,
      cplMin: ch.cplMin,
      cplMax: ch.cplMax,
      isNew: ch.isNew === true,
      tooltip: ch.tooltip ?? null,
    };
  });

  const totalLeads = projections.reduce((s, p) => s + p.leads, 0);
  const totalRevenue = projections.reduce((s, p) => s + p.revenue, 0);
  const roi = totalBudget > 0 ? Math.round((totalRevenue / totalBudget) * 100) : 0;

  // Best ROI channel
  const bestChannel = [...projections].sort((a, b) => {
    const aRoi = a.spend > 0 ? a.revenue / a.spend : 0;
    const bRoi = b.spend > 0 ? b.revenue / b.spend : 0;
    return bRoi - aRoi;
  })[0];

  return (
    <TooltipProvider>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Медиапланировщик</h1>
          <p className="mt-1 text-sm text-slate-500">Распределите бюджет по каналам и посмотрите прогноз</p>
        </div>

        {/* Budget input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ежемесячный бюджет</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
                className="w-40"
              />
              <span className="text-slate-500">₽/мес</span>
              <Slider
                min={10000}
                max={500000}
                step={5000}
                value={[totalBudget]}
                onValueChange={([v]) => setTotalBudget(v)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Channel allocations */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projections.map((proj, idx) => (
            <ChannelCard
              key={proj.name}
              proj={proj}
              isBest={proj.name === bestChannel?.name && proj.share > 0}
              onChangeShare={(v) => updateShare(idx, v)}
              onToggleLock={() => toggleLock(idx)}
            />
          ))}
        </div>

        {/* Summary */}
        <Card className="bg-slate-900 text-white">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              <div>
                <div className="text-2xl font-bold">{formatRub(totalBudget)}</div>
                <div className="text-sm text-slate-400">Общий бюджет</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{totalLeads}</div>
                <div className="text-sm text-slate-400">Прогноз лидов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{formatRub(totalRevenue)}</div>
                <div className="text-sm text-slate-400">Прогноз выручки</div>
              </div>
              <div>
                <div
                  className={cn(
                    "text-2xl font-bold",
                    roi >= 250 ? "text-green-400" : roi >= 150 ? "text-yellow-400" : "text-red-400",
                  )}
                >
                  {roi}%
                </div>
                <div className="text-sm text-slate-400">ROI прогноз</div>
              </div>
            </div>
            {totalShare !== 100 && (
              <p className="mt-4 text-center text-xs text-yellow-400">
                Распределено {totalShare}% из 100% — скорректируйте доли
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
