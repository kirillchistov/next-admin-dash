const basePath = process.env.NEXT_PUBLIC_PRISMB_BASE_PATH ?? "";

export const isPriSMBStaticExport = process.env.NEXT_PUBLIC_PRISMB_STATIC_EXPORT === "true";

export function prismbPath(path: `/${string}`): string {
  return `${basePath}${path}`;
}

export const prismbRoutes = {
  home: prismbPath("/prismb/"),
  login: prismbPath("/prismb/login/"),
  dashboard: prismbPath("/prismb/dashboard/"),
  profile: prismbPath("/prismb/profile/"),
  demo: isPriSMBStaticExport ? prismbPath("/prismb/dashboard/") : prismbPath("/api/prismb/demo-login"),
  auth: prismbPath("/api/prismb/auth"),
  logout: prismbPath("/api/prismb/logout"),
  switchClient: prismbPath("/api/prismb/switch-client"),
  importCsv: prismbPath("/api/prismb/import-csv"),
  metrikaConnect: prismbPath("/api/prismb/metrika/connect"),
  saveOnboarding: prismbPath("/api/prismb/save-onboarding"),
};
