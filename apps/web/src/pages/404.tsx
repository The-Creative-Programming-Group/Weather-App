import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "~/components/Layout";
import { useTranslation } from "next-i18next";

// For more information about 404 page, please visit https://nextjs.org/docs/pages/building-your-application/routing/custom-error#404-page
export default function Custom404() {
  const { t: translation404 } = useTranslation("404");
  const { t: translationCommon } = useTranslation("common");
  return (
    <Layout title={translationCommon("title 404 page")}>
      <div className="flex w-full flex-col items-center">
        <h1 className="mt-10 text-4xl font-bold">{translation404("title")}</h1>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["404", "common"])),
    },
  };
}
