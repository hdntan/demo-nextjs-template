import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local dev — Fastify server at port 4000
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/static/**' },
      // Production
      { protocol: 'https', hostname: 'api.edu.duthanhduoc.com', pathname: '/static/**' },
    ],
  },
}

export default nextConfig
