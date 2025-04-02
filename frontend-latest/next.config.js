/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: []
  },
  async rewrites() {
    return []
  },
  reactStrictMode: true,
  port: 3001
}

module.exports = nextConfig