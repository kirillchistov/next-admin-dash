import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  FeaturesSection,
  FooterSection,
  HeroSection,
  PricingSection,
  ProblemSection,
} from "./_components/landing-sections";

export default async function PriSMBRootPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("prismb_session")?.value;
  if (session) redirect("/prismb/dashboard");

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <span className="text-lg font-bold text-slate-900">PriSME</span>
        <div className="flex items-center gap-3">
          <a href="/prismb/login" className="text-sm text-slate-500 hover:text-slate-700">
            Войти
          </a>
          <a
            href="/api/prismb/demo-login"
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Демо
          </a>
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
