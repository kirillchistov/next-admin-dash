import { cookies } from "next/headers";

import { getClientData } from "@/data/prismb";

import { ReportContent } from "./_components/report-content";

export default async function ReportPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("prismb_client_id")?.value;
  const { companyProfile, weeklyReportData } = getClientData(clientId);

  return <ReportContent clientName={companyProfile.name} report={weeklyReportData} />;
}
