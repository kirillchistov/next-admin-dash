import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const isStaticExport = process.env.NEXT_EXPORT === "true";
const appDir = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: !isStaticExport,
  turbopack: {
    root: appDir,
    ...(isStaticExport && {
      resolveAlias: {
        "@/server/server-actions": "./src/server/server-actions.static.ts",
      },
    }),
  },
  ...(isStaticExport && {
    output: "export",
    basePath: "/next-admin-dash",
    trailingSlash: true,
    typescript: { ignoreBuildErrors: true },
  }),
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  ...(!isStaticExport && {
    async redirects() {
      return [
        {
          source: "/dashboard",
          destination: "/prismb",
          permanent: false,
        },
      ];
    },
  }),
};

export default nextConfig;
