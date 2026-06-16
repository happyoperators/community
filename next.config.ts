import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Cleaner static folder structure on Netlify (each route → its own index.html).
  trailingSlash: true,
};

export default nextConfig;
