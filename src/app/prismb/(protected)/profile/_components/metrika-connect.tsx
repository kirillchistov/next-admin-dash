"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { CheckCircle2, ExternalLink, Loader2, Unplug } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPriSMBStaticExport, prismbRoutes } from "@/lib/prismb-routes";

interface Props {
  connected: boolean;
  counterName?: string;
}

export function MetrikaConnect({ connected, counterName }: Props) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [counterId, setCounterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    if (isPriSMBStaticExport) {
      setLoading(false);
      setError("Подключение Метрики недоступно в статической демо-версии на GitHub Pages.");
      return;
    }

    const res = await fetch(prismbRoutes.metrikaConnect, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, counterId }),
    });
    const json = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Ошибка подключения");
      return;
    }
    router.refresh();
  }

  async function handleDisconnect() {
    if (isPriSMBStaticExport) return;
    await fetch(prismbRoutes.metrikaConnect, { method: "DELETE" });
    router.refresh();
  }

  if (connected) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <div>
            <div className="text-sm font-medium text-green-800">Яндекс.Метрика подключена</div>
            <div className="text-xs text-green-600">{counterName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700">Живые данные</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="gap-1 text-slate-500 hover:text-red-500"
          >
            <Unplug className="h-3.5 w-3.5" /> Отключить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">Яндекс.Метрика</div>
            <div className="mt-0.5 text-xs text-slate-400">Трафик и конверсии из вашего счётчика</div>
          </div>
          <Badge variant="outline" className="text-slate-400">
            Не подключено
          </Badge>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">ID счётчика</Label>
            <Input
              placeholder="12345678"
              value={counterId}
              onChange={(e) => setCounterId(e.target.value)}
              className="mt-1 h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">
              OAuth-токен{" "}
              <a
                href="https://oauth.yandex.ru/authorize?response_type=token&client_id=1d0b9dd4d652455a9eb710d450ff456a"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-blue-500 hover:underline"
              >
                получить <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </Label>
            <Input
              placeholder="y0_AgAAAA..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1 h-8 text-sm"
            />
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <Button
          className="mt-3 h-8 bg-blue-600 text-sm hover:bg-blue-700"
          onClick={handleConnect}
          disabled={loading || !token || !counterId}
        >
          {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          Подключить
        </Button>
      </div>
    </div>
  );
}
