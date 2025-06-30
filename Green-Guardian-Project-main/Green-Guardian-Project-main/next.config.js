/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Fix for react-syntax-highlighter
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    NEXT_PUBLIC_COPILOT_API_KEY: process.env.NEXT_PUBLIC_COPILOT_API_KEY || 'local-development',
  },
};

module.exports = nextConfig;
