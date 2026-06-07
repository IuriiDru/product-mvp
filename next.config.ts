import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Лендинг (public/landing.html) отдаётся как главная страница "/".
  // beforeFiles — чтобы перехватить "/" до файловых маршрутов.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/landing.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
