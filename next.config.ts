import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ark-auto-2100466578-cn-beijing-default.tos-cn-beijing.volces.com',
      },
      {
        protocol: 'https',
        hostname: 'chat.deepseek.com',
      },
      {
        protocol: 'https',
        hostname: 'obs-gdgz.cucloud.cn',
      }
    ],
  },
};

export default nextConfig;
