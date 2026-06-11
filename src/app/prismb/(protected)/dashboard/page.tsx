import { cookies } from "next/headers";

import { getClientData } from "@/data/prismb";

import { AlertsPanel } from "./_components/alerts-panel";
import { KPICards } from "./_components/kpi-cards";
import { Recommendations } from "./_components/recommendations";
import { TrafficChart } from "./_components/traffic-chart";

export default async function PriSMBDashboardPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("prismb_client_id")?.value;
  const data = getClientData(clientId);
  const { companyProfile, last30DaysMetrics, dailyTrafficData, channelBreakdown, recommendations } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{companyProfile.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Цель: {companyProfile.primaryGoal}</p>
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
