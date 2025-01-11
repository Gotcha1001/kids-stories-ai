// next.config.mjs
import "ts-node/register";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"], // Add Firebase Storage domain here
  },
};

export default nextConfig;
