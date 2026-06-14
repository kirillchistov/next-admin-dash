import { getClientData } from "@/data/prismb";
import { safeCookies } from "@/lib/prismb-cookies";

import { ChannelRevenue } from "./_components/channel-revenue";
import { RecentLeadsTable } from "./_components/recent-leads-table";
import { SalesKpiStrip } from "./_components/sales-kpi-strip";

export default async function SalesPage() {
  const cookieStore = await safeCookies();
  const clientId = cookieStore?.get("prismb_client_id")?.value;
  const data = getClientData(clientId);
  const { last30DaysMetrics, companyProfile, dailyTrafficData, channelBreakdown, recentLeads } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Продажи</h1>
        <p className="mt-1 text-sm text-slate-500">Выручка и заказы за последние 30 дней</p>
      </div>

      <SalesKpiStrip metrics={last30DaysMetrics} companyProfile={companyProfile} dailyTrafficData={dailyTrafficData} />

      <ChannelRevenue
        channels={channelBreakdown}
        metrics={last30DaysMetrics}
        avgOrderValue={companyProfile.avgOrderValue}
      />

      <RecentLeadsTable leads={recentLeads} />
    </div>
  );
}
