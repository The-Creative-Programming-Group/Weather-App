import {withAxiom} from 'next-axiom'
import withBundleAnalyzer from '@next/bundle-analyzer'
import pkg from './next-i18next.config.js'
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: 'public',
});

const { i18n } = pkg

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
    i18n
  }))
)
export default config
