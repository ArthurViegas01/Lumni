import type { NextConfig } from "next";
import { redirectRules, rewriteRules } from "./src/i18n/routes";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Exigido pelo React Three Fiber: https://r3f.docs.pmnd.rs/getting-started/installation
  transpilePackages: ["three"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // O layout raiz vive em app/[locale]; o 404 de URLs sem rota vem de app/global-not-found.tsx.
    globalNotFound: true,
  },
  // URLs traduzidas (src/i18n/routes.ts): /en/services/managed-it é servida pela pasta
  // app/[locale]/servicos/[slug]; a forma interna acessada direto redireciona para a pública.
  async redirects() {
    return redirectRules();
  },
  async rewrites() {
    return { beforeFiles: rewriteRules(), afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
