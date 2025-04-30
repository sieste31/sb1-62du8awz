/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'gokqhgrqpigwicuojlzh.supabase.co'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['127.0.0.1:3000', '.webcontainer.io'],
    },
  },
  optimizeFonts: false,
};

export default nextConfig;