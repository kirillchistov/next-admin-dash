"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Check, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { type OnboardingData, StepBusiness, StepChannels, StepDone, StepGoals } from "./_components/onboarding-steps";

const STEPS = ["О бизнесе", "Ваши цели", "Каналы", "Готово!"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({ budget: 100000, channels: [] });

  function updateData(updates: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }
  function next() {
    setStep((s) => Math.min(s + 1, 3));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i <= step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn("hidden text-sm sm:block", i === step ? "font-medium text-slate-900" : "text-slate-400")}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <ChevronRight className="hidden h-3 w-3 text-slate-300 sm:block" />}
            </div>
          ))}
        </div>
        {step === 0 && <StepBusiness data={data} onUpdate={updateData} onNext={next} />}
        {step === 1 && <StepGoals data={data} onUpdate={updateData} onNext={next} onBack={back} />}
        {step === 2 && <StepChannels data={data} onUpdate={updateData} onNext={next} onBack={back} />}
        {step === 3 && (
          <StepDone
            data={data}
            onGo={async () => {
              await fetch("/api/prismb/save-onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              router.push("/prismb/dashboard");
            }}
          />
        )}
      </div>
    </div>
  );
}
