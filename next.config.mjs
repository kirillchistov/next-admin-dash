const isStaticExport = process.env.NEXT_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: !isStaticExport,
  ...(isStaticExport && {
    output: "export",
    basePath: "/next-admin-dash",
    trailingSlash: true,
    typescript: { ignoreBuildErrors: true },
    turbopack: {
      resolveAlias: {
        "@/server/server-actions": "./src/server/server-actions.static.ts",
      },
    },
  }),
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  ...(!isStaticExport && {
    async redirects() {
      return [
        {
          source: "/dashboard",
          destination: "/dashboard/default",
          permanent: false,
        },
      ];
    },
  }),
};

export default nextConfig;
