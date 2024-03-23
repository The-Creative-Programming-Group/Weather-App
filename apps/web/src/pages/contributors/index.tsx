import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReactHtmlParser from "react-html-parser";

import iqbalProfile from "~/assets/bal-profile.jpg";
import dicsiluksProfile from "~/assets/dicsiluks-profile.webp";
import fabiusProfile from "~/assets/fabius-profile.jpg";
import jakeProfile from "~/assets/jake-profile.png";
import jakobProfile from "~/assets/jakob-profile.webp";
import Layout from "~/components/Layout";
import { getLocaleProps, useScopedI18n } from "~/locales";

const Contributors = () => {
  const translationCommon = useScopedI18n("common");
  const translationContributors = useScopedI18n("contributors");

  return (
    <Layout
      title={translationCommon("footer contributors")}
      classNameShareButton="mt-20 md:mt-28"
    >
      <div className="flex w-full flex-col items-center">
        <h1 className="mt-10 flex justify-center text-4xl font-bold">
          {translationCommon("footer contributors")}
        </h1>
        <hr className="mt-3 h-1.5 w-6/12 rounded bg-[#2d3142] md:w-4/12" />
        <div className="pb-6 pt-6 text-3xl">
          {ReactHtmlParser(translationContributors("made with love text"))}
        </div>
        <div className="flex flex-wrap justify-center gap-12">
          <div className="flex w-16 flex-col items-center gap-2 md:w-20">
            <Link
              href="https://www.roessner.tech"
              className="group relative inline-block aspect-square w-10 md:w-20"
            >
              <Image
                src={jakobProfile}
                alt="Jakob's logo"
                fill
                className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
              />
            </Link>
            <p className="flex text-center text-base md:text-xl">
              {translationContributors("founder")}
            </p>
          </div>
          <div className="flex w-16 flex-col items-center gap-2 md:w-20">
            <Link
              href="https://www.notion.so/iqbalrh/Hello-I-m-Iqbal-c8e26a91f13b464cb88a89eb1cb1082d?pvs=4"
              className="group relative inline-block aspect-square w-10 md:w-20"
            >
              <Image
                src={iqbalProfile}
                alt="Iqbal's logo"
                fill
                className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
              />
            </Link>
            <p className="flex text-center text-base md:text-xl">
              {translationContributors("designer")} &{" "}
              {translationContributors("translator")}
            </p>
          </div>
          <div className="flex w-16 flex-col items-center gap-2 md:w-20">
            <Link
              href="https://github.com/dicsiluks"
              className="group relative inline-block aspect-square w-10 md:w-20"
            >
              <Image
                src={dicsiluksProfile}
                alt="dicsiluks' logo"
                fill
                className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
              />
            </Link>
            <p className="flex text-center text-base md:text-xl">
              {translationContributors("designer")}
            </p>
          </div>
          <div className="flex w-16 flex-col items-center gap-2 md:w-20">
            <Link
              href="https://www.schurig.tech"
              className="group relative inline-block aspect-square w-10 md:w-20"
            >
              <Image
                src={fabiusProfile}
                alt="Fabius' logo"
                fill
                className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
              />
            </Link>
            <p className="flex text-center text-base md:text-xl">
              {translationContributors("designer")} &{" "}
              {translationContributors("engineer")}
            </p>
          </div>
          <div className="flex w-16 flex-col items-center gap-2 md:w-20">
            <Link
              href="https://github.com/dongjin2008"
              className="group relative inline-block aspect-square w-10 md:w-20"
            >
              <Image
                src={jakeProfile}
                alt="Jake's logo"
                fill
                className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
              />
            </Link>
            <p className="flex text-center text-base md:text-xl">
              {translationContributors("designer")} &{" "}
              {translationContributors("engineer")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps = getLocaleProps();

export default Contributors;
