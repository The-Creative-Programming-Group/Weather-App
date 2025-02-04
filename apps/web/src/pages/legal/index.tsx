import React from "react";
import Link from "next/link";

import Layout from "~/components/Layout";
import { getLocaleProps, useScopedI18n } from "~/locales";

const Legal = () => {
  const translationCommon = useScopedI18n("common");
  const translationLegal = useScopedI18n("legal");

  return (
    <>
      <Layout title={translationCommon("footer legal")}>
        <div className="mt-10 flex w-full flex-col items-center">
          <p className="text-3xl font-bold">
            {translationCommon("footer legal")}
          </p>
          <p className="mt-2.5">{translationLegal("information disclaimer")}</p>
          <p className="mt-1">Jakob Rössner</p>
          <a href="mailto:jakob.roessner@outlook.de" className="mt-1">
            {" "}
            jakob.roessner@outlook.de{" "}
          </a>
          <p className="mt-1">
            15755, Teupitz ST Tornow, {translationLegal("germany")}
          </p>
          <p className="mb-4 mt-14 w-7/12 md:w-4/12 xl:ml-7">
            {translationLegal("main text")}
          </p>
          <Link
            href="https://www.flaticon.com/free-icons/flags"
            title="flags icons"
            className="mt-4"
          >
            Flags icons created by Freepik - Flaticon
          </Link>
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps = getLocaleProps();

export default Legal;
