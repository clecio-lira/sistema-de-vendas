import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  disable: process.env.NODE_ENV !== "production",
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
});

const nextConfig: NextConfig = {};

export default withSerwist(nextConfig);
