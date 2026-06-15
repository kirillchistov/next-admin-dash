import { safeCookies } from "@/lib/prismb-cookies";

import {
  FeaturesSection,
  FooterSection,
  HeroSection,
  PricingSection,
  ProblemSection,
} from "./_components/landing-sections";

export default async function PriSMBRootPage() {
  const cookieStore = await safeCookies();
  const session = cookieStore?.get("prismb_session")?.value;

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between border-slate-100 border-b px-6 py-4">
        <span className="font-bold text-lg text-slate-900">PriSMB</span>
        <div className="flex items-center gap-3">
          {session ? (
            <a
              href="/prismb/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-1.5 font-medium text-sm text-white hover:bg-blue-700"
            >
              Перейти в дашборд
            </a>
          ) : (
            <>
              <a href="/prismb/login" className="text-slate-500 text-sm hover:text-slate-700">
                Войти
              </a>
              <a
                href="/api/prismb/demo-login"
                className="rounded-lg bg-blue-600 px-4 py-1.5 font-medium text-sm text-white hover:bg-blue-700"
              >
                Демо
              </a>
            </>
          )}
        </div>
      </nav>

      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
}
