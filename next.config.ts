import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Лендинг (public/landing.html) отдаётся как главная страница "/".
  // beforeFiles — чтобы перехватить "/" до файловых маршрутов.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/landing.html" },
        { source: "/privacy", destination: "/privacy.html" },
        { source: "/consent", destination: "/consent.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
