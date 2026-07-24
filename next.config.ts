/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🎯 Typescript aur ESLint errors build ko fail nahi karenge
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
