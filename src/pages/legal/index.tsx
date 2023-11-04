import React from "react";
import Layout from "~/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const legal = () => {
  const { t: translationCommon } = useTranslation("common");
  const { t: translationLegal } = useTranslation("legal");

  return (
    <>
      <Layout title={translationCommon("footer legal")}>
        <div className="mt-10 flex w-full flex-col items-center">
          <p className="text-3xl font-bold">
            {translationCommon("footer legal")}
          </p>
          <p className="mt-2.5">{translationLegal("information disclaimer")}</p>
          <p className="mt-1">Jakob Rössner</p>
          <p className="mt-1">+49 1512 5404979</p>
          <p className="mt-1">
            15755, Teupitz ST Tornow, {translationLegal("germany")}
          </p>
          <p className="mb-4 mt-14 w-7/12 md:w-4/12 xl:ml-7">
            {translationLegal("main text")}
          </p>
        </div>
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["legal", "common"])),
    },
  };
}

export default legal;
