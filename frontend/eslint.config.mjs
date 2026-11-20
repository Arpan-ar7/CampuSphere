// ─────────────────────────────────────────────────────────────
//  Code-checking rules (run with `npm run lint`).
//  core-web-vitals = Next.js + React + accessibility rules
//  typescript      = extra rules for .ts/.tsx files
// ─────────────────────────────────────────────────────────────
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Folders that are generated, never hand-written
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
