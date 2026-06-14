import { getClientData } from "@/data/prismb";
import { safeCookies } from "@/lib/prismb-cookies";

import { TrafficChart } from "../dashboard/_components/traffic-chart";
import { TopPages } from "./_components/top-pages";
import { TrafficKpiStrip } from "./_components/traffic-kpi-strip";
import { TrafficSources } from "./_components/traffic-sources";

export default async function AnalyticsPage() {
  const cookieStore = await safeCookies();
  const clientId = cookieStore?.get("prismb_client_id")?.value;
  const data = getClientData(clientId);
  const { last30DaysMetrics, channelBreakdown, dailyTrafficData, topPages } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Трафик</h1>
        <p className="mt-1 text-sm text-slate-500">Посетители, источники и поведение на сайте за 30 дней</p>
      </div>

      <TrafficKpiStrip metrics={last30DaysMetrics} channels={channelBreakdown} />

      <TrafficChart data={dailyTrafficData} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TrafficSources channels={channelBreakdown} />
        <TopPages pages={topPages} />
      </div>
    </div>
  );
}
