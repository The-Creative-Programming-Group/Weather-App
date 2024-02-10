import type { NextPage } from "next";
import { useLayoutEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import background from "~/assets/background.png";
import { getLocaleProps, useScopedI18n } from "~/locales";
import { activeCity$ } from "~/states";

const PublicHome: NextPage = () => {
  const translation = useScopedI18n("common");
  const router = useRouter();

  useLayoutEffect(() => {
    if (activeCity$.id.get() !== 0 && activeCity$.name.get() !== "") {
      void router.push("/home");
    }
  });

  return (
    <>
      <Head>
        <title>Weather.io</title>
        <meta name="description" content="An faboulus weather website" />
        <meta
          property="og:image"
          content="/_next/image?url=%2Fog-image.png&w=640&q=75"
        />
      </Head>
      <Image
        src={background}
        alt="background"
        className="-z-10 object-cover"
        fill
      />
      <div className="relative flex h-screen flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl md:text-8xl">{translation("title")}</h1>
          <h2 className="text-2xl md:text-4xl">{translation("location")}</h2>
        </div>
        <Link
          href="/search"
          className="mt-4 rounded-lg bg-[#2d3142] px-3 py-2 text-xl text-white transition duration-500 ease-in-out hover:shadow-2xl sm:text-2xl md:px-5 md:py-4 md:text-4xl"
        >
          {translation("start button")}
        </Link>
      </div>
    </>
  );
};

export const getStaticProps = getLocaleProps();

export default PublicHome;
