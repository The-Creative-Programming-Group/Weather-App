import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "~/components/Layout";
import { useTranslation } from "next-i18next";

// This page is rendered when the user installed the PWA and is offline
export default function OfflinePage() {
  const { t: translationOffline } = useTranslation("offline");
  const { t: translationCommon } = useTranslation("common");
  return (
    <Layout title={translationCommon("title offline page")}>
      <div className="flex w-full flex-col items-center">
        <h1 className="mt-10 text-4xl font-bold">
          {translationOffline("title")}
        </h1>
        <p>{translationOffline("message")}</p>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["offline", "common"])),
    },
  };
}
