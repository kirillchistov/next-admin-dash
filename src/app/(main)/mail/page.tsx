import { safeCookies } from "@/lib/prismb-cookies";

import { mails } from "./_components/data";
import { MailComponent } from "./_components/mail";
import { DEFAULT_MAIL_LAYOUT, MAIL_LAYOUT_COOKIE } from "./_components/mail-layout-config";

export default async function Page() {
  const cs = await safeCookies();
  const layoutCookie = cs?.get(MAIL_LAYOUT_COOKIE)?.value;

  return (
    <div className="h-dvh min-h-0 overflow-hidden">
      <MailComponent mails={mails} defaultLayout={layoutCookie ? JSON.parse(layoutCookie) : [...DEFAULT_MAIL_LAYOUT]} />
    </div>
  );
}
