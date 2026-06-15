"use client";

import { useEffect, useRef, useState } from "react";

import { Bot, Database, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatResponses } from "@/data/prismb";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  source?: string;
  timestamp: Date;
}

const PRESET_QUESTIONS = [
  "Почему упали продажи?",
  "Составь план на квартал",
  "Стоит ли пробовать Telegram?",
  "Как обойти конкурентов?",
];

type ResponseRule = { match: (s: string) => boolean; key: string; source: string };
const RESPONSE_RULES: ResponseRule[] = [
  {
    match: (s) => s.includes("упали") && (s.includes("продаж") || s.includes("лид")),
    key: "упали продажи",
    source: "Данные Яндекс.Директ, VK Ads за последние 30 дней",
  },
  {
    match: (s) => s.includes("увелич") || s.includes("больше продаж"),
    key: "увеличить продажи",
    source: "Данные по каналам и CPA за последние 30 дней",
  },
  {
    match: (s) => s.includes("telegram") || s.includes("телеграм"),
    key: "telegram",
    source: "Бенчмарки рынка B2C Россия 2024-2025",
  },
  {
    match: (s) => s.includes("план") || s.includes("кварт"),
    key: "план на квартал",
    source: "Анализ текущих показателей и целей компании",
  },
  { match: (s) => s.includes("конкурент"), key: "конкуренты", source: "Данные анализа видимости конкурентов" },
];
const FALLBACK_RESPONSE = {
  text: "Я анализирую данные вашей компании и готов помочь с вопросами по рекламе. Попробуйте спросить:\n• Почему упали продажи?\n• Как снизить стоимость клиента?\n• Какой канал самый эффективный?",
  source: "PriSMB AI",
};

function getResponse(text: string): { text: string; source: string } {
  const lower = text.toLowerCase();
  const rule = RESPONSE_RULES.find((r) => r.match(lower));
  if (rule) return { text: chatResponses[rule.key] ?? FALLBACK_RESPONSE.text, source: rule.source };
  return FALLBACK_RESPONSE;
}

let msgCounter = 0;
function nextId(): string {
  return `msg-${++msgCounter}`;
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-0",
      role: "assistant",
      text: "Привет! Я ваш ИИшник - маркетолог. У меня есть данные Атлант-Оптики за последние 30 дней и помогу разобраться в ситуации. Спросите меня о продажах, рекламных каналах или конкурентах.",
      source: "PriSMB AI",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const msgCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally scroll on count/typing changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgCount, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: nextId(), role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const { text: responseText, source } = getResponse(text);
      const botMsg: Message = {
        id: nextId(),
        role: "assistant",
        text: responseText,
        source,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">ИИшник</h1>
        <p className="mt-1 text-sm text-slate-500">Задайте вопрос о вашей рекламе — отвечу на основе реальных данных</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden rounded-xl border bg-white shadow-sm">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={cn("max-w-[80%]", msg.role === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm",
                      msg.role === "user"
                        ? "rounded-tr-sm bg-blue-600 text-white"
                        : "rounded-tl-sm bg-slate-100 text-slate-800",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  {msg.source && msg.role === "assistant" && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <Database className="h-3 w-3" />
                      <span>На основе: {msg.source}</span>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
                  <div className="flex h-4 items-center gap-1">
                    <div
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Preset questions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESET_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendMessage(q)}
            className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-100"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mt-2 flex gap-2">
        <Input
          placeholder="Задайте вопрос..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          className="flex-1"
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
