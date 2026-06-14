import { getClientData } from "@/data/prismb";
import { safeCookies } from "@/lib/prismb-cookies";

import { LeadsFunnel } from "./_components/leads-funnel";
import { LeadsKpi } from "./_components/leads-kpi";
import { LeadsTable } from "./_components/leads-table";

export default async function LeadsPage() {
  const cookieStore = await safeCookies();
  const clientId = cookieStore?.get("prismb_client_id")?.value;
  const data = getClientData(clientId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Лиды</h1>
        <p className="mt-1 text-sm text-slate-500">Воронка привлечения и конверсия за 30 дней</p>
      </div>

      <LeadsKpi metrics={data.last30DaysMetrics} companyProfile={data.companyProfile} />

      <LeadsFunnel metrics={data.last30DaysMetrics} channels={data.channelBreakdown} />

      <LeadsTable leads={data.recentLeads} />
    </div>
  );
}
