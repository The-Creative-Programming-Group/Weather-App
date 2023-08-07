import { type AppType } from "next/app";

import "~/styles/globals.css";
import { api } from "~/lib/utils/api";
import { Inter } from "next/font/google";
import React from "react";
import { Analytics } from "@vercel/analytics/react";

// Next font inter

const inter = Inter({ subsets: ["latin-ext"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
