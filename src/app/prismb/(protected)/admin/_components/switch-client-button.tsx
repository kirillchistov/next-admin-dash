"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { isPriSMBStaticExport, prismbRoutes } from "@/lib/prismb-routes";

export function SwitchClientButton({ clientId }: { clientId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSwitch() {
    setLoading(true);
    if (!isPriSMBStaticExport) {
      await fetch(prismbRoutes.switchClient, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
    }
    router.push(prismbRoutes.dashboard);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleSwitch} disabled={loading}>
      {loading ? "..." : "Открыть"}
    </Button>
  );
}
