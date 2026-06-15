import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "PriSMB Dashboard",
  version: packageJson.version,
  copyright: `© ${currentYear}, PriSMB Dashboard.`,
  meta: {
    title: "PriSMB Dashboard - Ваш зам. по маркетингу",
    description: "PriSMB Dashboard - Маркетинговый эксперт для владельцев малого бизнеса.",
  },
};
