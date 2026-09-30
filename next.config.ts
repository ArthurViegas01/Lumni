import type { NextConfig } from "next";

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
};

export default nextConfig;
