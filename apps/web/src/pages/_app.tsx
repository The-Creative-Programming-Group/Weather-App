import type { AppProps, AppType } from "next/app";

import "~/styles/globals.css";

import React from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AxiomWebVitals } from "next-axiom";

import { Toaster } from "@weatherio/ui/sonner";

import ConvexClientProvider from "~/components/ConvexClientProvider";
import { PWALifeCycle } from "~/components/PWALifecycle";
import { api } from "~/lib/utils/api";
import en from "~/locales/en";
import { I18nProvider } from "../locales";

// Next font inter
const inter = Inter({ subsets: ["latin-ext"] });

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ConvexClientProvider>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */}
      <I18nProvider locale={pageProps.locale} fallbackLocale={en}>
        <Head>
          <meta
            name="google-site-verification"
            content="CS1KT9NHuQNxYoO-nTeSkqI_kThuGx7dEAw4VJ6AD8I"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#2d3142" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <PWALifeCycle />
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
        <Toaster richColors />
      </I18nProvider>
      <Analytics />
      <SpeedInsights />
      <AxiomWebVitals />
      <ReactQueryDevtools initialIsOpen={false} />
    </ConvexClientProvider>
  );
};

export default api.withTRPC(MyApp);
