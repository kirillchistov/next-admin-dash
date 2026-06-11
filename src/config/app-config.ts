import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "PriSME Dashboard",
  version: packageJson.version,
  copyright: `© ${currentYear}, PriSME Dashboard.`,
  meta: {
    title: "PriSME Dashboard - Ваш зам. по маркетингу",
    description: "PriSME Dashboard - Маркетинговый эксперт для владельцев малого бизнеса.",
  },
};
