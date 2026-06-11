import { cookies } from "next/headers";

import type { ImportedChannelsCookie } from "@/app/api/prismb/import-csv/route";
import type { MetrikaCookie } from "@/app/api/prismb/metrika/connect/route";
import type { OnboardingCookie } from "@/app/api/prismb/save-onboarding/route";
import { getClientData } from "@/data/prismb";
import { fetchMetrikaTraffic } from "@/lib/prismb-metrika";

import { AlertsPanel } from "./_components/alerts-panel";
import { ExportButton } from "./_components/export-button";
import { KPICards } from "./_components/kpi-cards";
import { Recommendations } from "./_components/recommendations";
import { TrafficChart } from "./_components/traffic-chart";

export default async function PriSMBDashboardPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("prismb_client_id")?.value;
  const data = getClientData(clientId);

  const onboardingRaw = cookieStore.get("prismb_onboarding")?.value;
  const onboarding: OnboardingCookie | null = onboardingRaw ? (JSON.parse(onboardingRaw) as OnboardingCookie) : null;

  const companyProfile =
    onboarding && !clientId
      ? {
          ...data.companyProfile,
          name: onboarding.companyName,
          industry: onboarding.industry || data.companyProfile.industry,
          primaryGoal: onboarding.goal || data.companyProfile.primaryGoal,
          monthlyAdBudget: onboarding.budget,
          channels: onboarding.channels.length ? onboarding.channels : data.companyProfile.channels,
        }
      : data.companyProfile;

  const metrikaRaw = cookieStore.get("prismb_metrika")?.value;
  const metrika: MetrikaCookie | null = metrikaRaw ? (JSON.parse(metrikaRaw) as MetrikaCookie) : null;
  const liveTraffic = metrika ? await fetchMetrikaTraffic(metrika.token, metrika.counterId) : null;

  const importedRaw = cookieStore.get("prismb_imported_channels")?.value;
  const imported: ImportedChannelsCookie | null = importedRaw
    ? (JSON.parse(importedRaw) as ImportedChannelsCookie)
    : null;

  const { last30DaysMetrics, recommendations } = data;
  const dailyTrafficData = liveTraffic ?? data.dailyTrafficData;
  const channelBreakdown = imported?.channels ?? data.channelBreakdown;

  const dataSources = [liveTraffic && "Метрика", imported && "Директ CSV"].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{companyProfile.name}</h1>
            {dataSources.map((src) => (
              <span
                key={src}
                className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                {src}
              </span>
            ))}
          </div>
          <p className="mt-1 text-sm text-slate-500">Цель: {companyProfile.primaryGoal}</p>
        </div>
        <ExportButton
          companyName={companyProfile.name}
          dailyTrafficData={dailyTrafficData}
          channelBreakdown={channelBreakdown}
        />
      </div>

      <KPICards companyProfile={companyProfile} metrics={last30DaysMetrics} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficChart data={dailyTrafficData} />
        </div>
        <div>
          <AlertsPanel
            channelBreakdown={channelBreakdown}
            targetCPA={companyProfile.targetCPA}
            totalSpend={last30DaysMetrics.totalSpend}
          />
        </div>
      </div>

      <Recommendations items={recommendations} />
    </div>
  );
}
