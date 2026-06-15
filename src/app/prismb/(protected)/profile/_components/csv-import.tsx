"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { CheckCircle2, FileSpreadsheet, Loader2, Trash2, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { parseDirectCsv } from "@/lib/prismb-csv";
import { cn } from "@/lib/utils";

interface Props {
  imported: boolean;
  importedAt?: string;
  channelCount?: number;
}

export function CsvImport({ imported, importedAt, channelCount }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFile(file: File) {
    setErrors([]);
    setLoading(true);
    const text = await file.text();
    const { channels, errors: parseErrors } = parseDirectCsv(text);
    if (parseErrors.length || !channels.length) {
      setErrors(parseErrors.length ? parseErrors : ["Не удалось распознать формат файла"]);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/prismb/import-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channels, source: file.name }),
    });
    setLoading(false);
    if (!res.ok) {
      setErrors(["Ошибка сохранения данных"]);
      return;
    }
    router.refresh();
  }

  async function handleRemove() {
    await fetch("/api/prismb/import-csv", { method: "DELETE" });
    router.refresh();
  }

  if (imported) {
    const date = importedAt ? new Date(importedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) : "";
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <div>
            <div className="text-sm font-medium text-green-800">Данные Яндекс.Директ загружены</div>
            <div className="text-xs text-green-600">
              {channelCount} кампаний · {date}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700">Активно</Badge>
          <Button variant="ghost" size="sm" onClick={handleRemove} className="gap-1 text-slate-500 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" /> Удалить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Яндекс.Директ (CSV)</div>
          <div className="mt-0.5 text-xs text-slate-400">Загрузите экспорт статистики по кампаниям</div>
        </div>
        <Badge variant="outline" className="text-slate-400">
          Не загружено
        </Badge>
      </div>

      <button
        type="button"
        className="mt-3 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-6 transition-colors hover:border-blue-300 hover:bg-blue-50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) void handleFile(f);
        }}
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        ) : (
          <>
            <FileSpreadsheet className="h-6 w-6 text-slate-400" />
            <div className="text-center">
              <div className="text-sm font-medium text-slate-600">Перетащите CSV или нажмите</div>
              <div className="mt-0.5 text-xs text-slate-400">Экспорт из Яндекс.Директ → Статистика → CSV</div>
            </div>
            <span className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}>
              <Upload className="h-3.5 w-3.5" /> Выбрать файл
            </span>
          </>
        )}
      </button>

      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {errors.map((e) => (
            <p key={e} className="text-xs text-red-600">
              {e}
            </p>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv,.txt"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
    </div>
  );
}
