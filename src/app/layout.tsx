import type { ReactNode } from "react";

import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_CONFIG } from "@/config/app-config";
import { fontRegistry, fontVars } from "@/lib/fonts/registry";
import {
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
} from "@/lib/preferences/layout";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES } from "@/lib/preferences/theme";
import { safeCookies } from "@/lib/prismb-cookies";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

type CookieStore = Awaited<ReturnType<typeof safeCookies>>;
type FontKey = keyof typeof fontRegistry;

const FONT_VALUES = Object.keys(fontRegistry) as FontKey[];

function getCookiePreference<T extends string>(
  cookieStore: CookieStore,
  key: string,
  fallback: T,
  allowedValues: readonly T[],
): T {
  const value = cookieStore?.get(key)?.value;
  return allowedValues.includes(value as T) ? (value as T) : fallback;
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await safeCookies();
  const theme_mode = getCookiePreference(cookieStore, "theme_mode", PREFERENCE_DEFAULTS.theme_mode, THEME_MODE_VALUES);
  const theme_preset = getCookiePreference(
    cookieStore,
    "theme_preset",
    PREFERENCE_DEFAULTS.theme_preset,
    THEME_PRESET_VALUES,
  );
  const content_layout = getCookiePreference(
    cookieStore,
    "content_layout",
    PREFERENCE_DEFAULTS.content_layout,
    CONTENT_LAYOUT_VALUES,
  );
  const navbar_style = getCookiePreference(
    cookieStore,
    "navbar_style",
    PREFERENCE_DEFAULTS.navbar_style,
    NAVBAR_STYLE_VALUES,
  );
  const sidebar_variant = getCookiePreference(
    cookieStore,
    "sidebar_variant",
    PREFERENCE_DEFAULTS.sidebar_variant,
    SIDEBAR_VARIANT_VALUES,
  );
  const sidebar_collapsible = getCookiePreference(
    cookieStore,
    "sidebar_collapsible",
    PREFERENCE_DEFAULTS.sidebar_collapsible,
    SIDEBAR_COLLAPSIBLE_VALUES,
  );
  const font = getCookiePreference(cookieStore, "font", PREFERENCE_DEFAULTS.font, FONT_VALUES);

  return (
    <html
      lang="en"
      className={theme_mode === "dark" ? "dark" : undefined}
      data-theme-mode={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={font}
      suppressHydrationWarning
    >
      <body className={`${fontVars} min-h-screen antialiased`}>
        <TooltipProvider>
          <PreferencesStoreProvider
            themeMode={theme_mode}
            themePreset={theme_preset}
            contentLayout={content_layout}
            navbarStyle={navbar_style}
            font={font}
          >
            {children}
            <Toaster />
          </PreferencesStoreProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
