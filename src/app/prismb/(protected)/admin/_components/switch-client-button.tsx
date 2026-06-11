"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function SwitchClientButton({ clientId }: { clientId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSwitch() {
    setLoading(true);
    await fetch("/api/prismb/switch-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });
    router.push("/prismb/dashboard");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleSwitch} disabled={loading}>
      {loading ? "..." : "Открыть"}
    </Button>
  );
}
