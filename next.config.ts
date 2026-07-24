/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🎯 Build time par TypeScript aur ESLint errors ignore karne ke liye
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
