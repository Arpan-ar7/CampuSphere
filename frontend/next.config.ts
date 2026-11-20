// ─────────────────────────────────────────────────────────────
//  Next.js settings for the CampuSphere frontend.
//  Docs for this exact version: node_modules/next/dist/docs/
// ─────────────────────────────────────────────────────────────

import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

// The backend's address (from .env.local). The browser is only allowed to call this + our own site.
const apiOrigin: string = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').origin
  } catch {
    return ''
  }
})()

/*
  Content Security Policy = a list of what the browser may load/run on our pages.
  If someone manages to inject a script tag or a link to another site, the browser refuses it.
  - scripts/styles: only from our own site ('unsafe-inline' is needed by Next.js without nonces,
    'unsafe-eval' only while developing — React uses it for better error messages)
  - connect-src: only our site + the backend API (+ the dev server's live-reload socket)
  - frame-ancestors 'none': nobody can put CampuSphere inside an <iframe> (stops click-jacking)
*/
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self' ${apiOrigin}${isDev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' }, // older browsers: no iframes
  { key: 'X-Content-Type-Options', value: 'nosniff' }, // don't guess file types
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, // don't leak full URLs to other sites
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' }, // features we never use
]

const nextConfig: NextConfig = {
  // Faster navigation: pages are pre-built and recently visited pages stay alive in the background
  cacheComponents: true,
  partialPrefetching: true,

  // Don't advertise "X-Powered-By: Next.js" (less info for attackers)
  poweredByHeader: false,

  // Send the security headers above with every page
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },

  experimental: {
    instantInsights: {
      // Our pages need the login saved in the browser before they can render, so the
      // server sends a loading screen first. Only check pages that opt in with `export const instant`.
      validationLevel: 'manual-warning',
    },
  },

  // Tailwind CSS v4 runs through Turbopack (the Next.js bundler)
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
