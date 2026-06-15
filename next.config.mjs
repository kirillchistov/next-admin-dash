import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const isStaticExport = process.env.NEXT_EXPORT === "true";
const appDir = dirname(fileURLToPath(import.meta.url));
const staticBasePath = "/next-admin-dash";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: !isStaticExport,
  env: {
    NEXT_PUBLIC_PRISMB_BASE_PATH: isStaticExport ? staticBasePath : "",
    NEXT_PUBLIC_PRISMB_STATIC_EXPORT: isStaticExport ? "true" : "false",
  },
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
    basePath: staticBasePath,
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
