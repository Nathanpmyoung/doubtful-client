/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.resolve.alias.yjs = 'node_modules/yjs'
    return config;
  }
}

module.exports = nextConfig
