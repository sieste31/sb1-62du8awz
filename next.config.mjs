/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'gokqhgrqpigwicuojlzh.supabase.co'],
  },
};

export default nextConfig;