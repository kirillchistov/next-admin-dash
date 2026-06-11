import { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { adminClients } from "@/data/prismb";
import type { PriSMBRole } from "@/lib/prismb-auth";

import { PriSMBSidebar } from "./_components/prismb-sidebar";

export default async function PriSMBProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sessionVal = cookieStore.get("prismb_session")?.value;
  if (!sessionVal || (sessionVal !== "demo" && sessionVal !== "admin")) {
    redirect("/prismb/login");
  }
  const session = sessionVal as PriSMBRole;

  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const clientIdCookie = cookieStore.get("prismb_client_id")?.value;
  const activeClientId = clientIdCookie ? Number(clientIdCookie) : 1;
  const activeClient = adminClients.find((c) => c.id === activeClientId) ?? adminClients[0];

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <PriSMBSidebar
        role={session}
        activeClientName={activeClient.name}
        activeClientId={activeClient.id}
        clients={session === "admin" ? adminClients : undefined}
      />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
