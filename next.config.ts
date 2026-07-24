/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/googleda03cfbbb2a469da.html', // 👈 Yahan apni Google HTML file ka exact naam dalo
        destination: '/api/google-verify',
      },
    ];
  },
};

export default nextConfig;
