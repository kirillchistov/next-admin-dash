import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnalyticsKpiStrip } from "./_components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";
import { EngagementMomentumCard } from "./_components/engagement-momentum-card";
import { TrafficTrendCard } from "./_components/traffic-trend-card";
import "@/styles/flag-icons/flags.css";
// import { VisitorCoverageCard } from "./_components/visitor-coverage-card";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Hello, Aiy</h1>
        <p className="text-muted-foreground text-sm">
          Monitor traffic, engagement, and conversion performance in one view.
        </p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
          </TabsList>

          <AnalyticsToolbar />
        </div>

        <TabsContent value="overview" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <AnalyticsKpiStrip />
          <EngagementMomentumCard />
          <TrafficTrendCard />
          {/* <VisitorCoverageCard /> */}
        </TabsContent>

        <TabsContent value="audience">
          <AnalyticsTabPlaceholder label="Audience view coming soon." />
        </TabsContent>

        <TabsContent value="acquisition">
          <AnalyticsTabPlaceholder label="Acquisition view coming soon." />
        </TabsContent>

        <TabsContent value="engagement">
          <AnalyticsTabPlaceholder label="Engagement view coming soon." />
        </TabsContent>

        <TabsContent value="conversions">
          <AnalyticsTabPlaceholder label="Conversions view coming soon." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsTabPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
      {label}
    </div>
  );
}
