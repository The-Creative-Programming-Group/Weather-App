// Importing env files here to validate on build
import './src/env.mjs'
import '@weatherio/api/env'
import withBundleAnalyzer from '@next/bundle-analyzer'
import withPWAInit from '@ducanh2912/next-pwa'
import {withAxiom} from 'next-axiom'

const withPWA = withPWAInit({
  dest: 'public',
  fallbacks: {
    document: '/_offline'
  }
})

// create the bundle analyzer config
const withMyBundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

/** @type {import("next").NextConfig} */
const config = withMyBundleAnalyzer(withPWA(
  withAxiom({
    reactStrictMode: true,

    /** Enables hot reloading for local packages without a build step */
    transpilePackages: ['@weatherio/api', '@weatherio/ui', '@weatherio/types', '@weatherio/city-data'],
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'de']
    }
  }))
)

export default config
