/**
 * Input: next, velite (build)
 * Output: nextConfig (default, Promise via withVelite)
 * Pos: 配置层-Next：Velite构建、静态导出、安全头、重定向
 *
 * 本注释在文件修改时自动更新
 */

import type { NextConfig } from 'next'
import { build } from 'velite'

const securityHeaders = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

async function withVelite(nextConfig: NextConfig): Promise<NextConfig> {
  await build({ clean: true })
  return nextConfig
}

const nextConfig = withVelite({
  transpilePackages: ['velite'],
  reactStrictMode: true,
  cleanDistDir: true,
  images: {
    unoptimized: true,
    minimumCacheTTL: 604800,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(process.env.CF_PAGES === 'true'
    ? { output: 'export' as const }
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [...securityHeaders],
            },
          ]
        },
        async redirects() {
          return [
            {
              source: '/blog/:slug*',
              destination: '/posts/:slug*',
              permanent: true,
            },
            {
              source: '/portfoilo/:slug*',
              destination: '/photography/:slug*',
              permanent: true,
            },
            {
              source: '/about',
              destination: '/',
              permanent: true,
            },
            {
              source: '/desk-new-layout',
              destination: '/posts/new-desktop-layout',
              permanent: true,
            },
            {
              source: '/bladerunner-revisit',
              destination: '/posts/bladerunner-revisit',
              permanent: true,
            },
          ]
        },
        async rewrites() {
          return [
            {
              source: '/sight/app.js',
              destination: 'https://sight.aozaki.cc/app.js',
            },
            {
              source: '/sight/event',
              destination: 'https://sight.aozaki.cc/api/event',
            },
          ]
        },
      }),
})

export default nextConfig
