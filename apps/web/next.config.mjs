import createJiti from "jiti";
import {fileURLToPath} from "node:url";
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

const jiti = createJiti(fileURLToPath(import.meta.url));

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 * Importing env files here to validate on build
 */
jiti("./src/env.ts");
jiti("@weatherio/api/env")

/** @type {import("next").NextConfig} */
const config = withMyBundleAnalyzer(withPWA(
  withAxiom({
    reactStrictMode: true,

    /** Enables hot reloading for local packages without a build step */
    transpilePackages: ['@weatherio/api', '@weatherio/ui', '@weatherio/types'],
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'de', 'id']
    }
  }))
)

export default config
