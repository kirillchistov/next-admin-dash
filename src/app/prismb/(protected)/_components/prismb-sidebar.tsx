"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  CalendarDays,
  Search,
  PenSquare,
  Building2,
  CreditCard,
  Users,
  TrendingUp,
  LogOut,
  ChevronDown,
  Check,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { adminClients } from "@/data/prismb";
import type { PriSMBRole } from "@/lib/prismb-auth";
import { cn } from "@/lib/utils";

type Client = (typeof adminClients)[number];

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const analyticsNav: NavItem[] = [
  { href: "/prismb/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/prismb/report", label: "Недельный отчёт", icon: FileText },
];
const toolsNav: NavItem[] = [
  { href: "/prismb/advisor", label: "ИИшник", icon: MessageSquare },
  { href: "/prismb/planner", label: "Медиапланер", icon: CalendarDays },
  { href: "/prismb/competitors", label: "Конкуренты", icon: Search },
  { href: "/prismb/content", label: "Контент", icon: PenSquare },
];
const settingsNav: NavItem[] = [
  { href: "/prismb/profile", label: "Профиль компании", icon: Building2 },
  { href: "/prismb/profile#subscription", label: "Подписка", icon: CreditCard },
];
const adminNav: NavItem[] = [{ href: "/prismb/admin", label: "Клиенты", icon: Users }];

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/prismb/dashboard" && pathname.startsWith(item.href.split("#")[0]));
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

interface Props {
  role: PriSMBRole;
  activeClientName: string;
  activeClientId: number;
  clients?: Client[];
}

export function PriSMBSidebar({ role, activeClientName, activeClientId, clients = [] }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  async function handleLogout() {
    await fetch("/api/prismb/logout", { method: "POST" });
    router.push("/prismb/login");
  }

  async function handleSwitch(clientId: number) {
    if (clientId === activeClientId) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    await fetch("/api/prismb/switch-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });
    setOpen(false);
    setSwitching(false);
    router.push("/prismb/dashboard");
    router.refresh();
  }

  const isAdmin = role === "admin";

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">PriSMB</span>
        </div>

        {/* Company switcher — interactive for admin, static for demo */}
        {isAdmin ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "mx-2 mb-2 flex w-[calc(100%-16px)] items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm",
                  "cursor-pointer transition-colors hover:bg-slate-200",
                  open && "bg-slate-200",
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate font-medium text-slate-700">{activeClientName}</span>
                </div>
                <ChevronDown
                  className={cn("h-3 w-3 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-1" align="start" side="bottom">
              <div className="px-2 py-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">Клиенты</div>
              {clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSwitch(c.id)}
                  disabled={switching}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
                    c.id === activeClientId ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      c.id === activeClientId ? "text-blue-600" : "text-transparent",
                    )}
                  />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.name}</div>
                    <div className="truncate text-xs text-slate-400">{c.industry}</div>
                  </div>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        ) : (
          <div className="mx-2 mb-2 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm">
            <Building2 className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="truncate font-medium text-slate-700">{activeClientName}</span>
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <NavGroup label="АНАЛИТИКА" items={analyticsNav} />
        <NavGroup label="ИНСТРУМЕНТЫ" items={toolsNav} />
        <NavGroup label="НАСТРОЙКИ" items={settingsNav} />
        {isAdmin && (
          <>
            <SidebarSeparator />
            <NavGroup label="АДМИНИСТРАТОР" items={adminNav} />
          </>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="flex items-center justify-between border-t px-3 py-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                {role === "admin" ? "AD" : "ДМ"}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs">
              <div className="font-medium text-slate-700">{role === "admin" ? "Администратор" : "Демо-аккаунт"}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 transition-colors hover:text-red-500" title="Выйти">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
