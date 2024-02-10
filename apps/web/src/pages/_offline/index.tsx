import Layout from "~/components/Layout";
import { getLocaleProps, useScopedI18n } from "~/locales";

// This page is rendered when the user installed the PWA and is offline
export default function OfflinePage() {
  const translationOffline = useScopedI18n("offline");
  const translationCommon = useScopedI18n("common");
  return (
    <Layout title={translationCommon("title offline page")}>
      <div className="flex w-full flex-col items-center">
        <h1 className="mt-10 text-4xl font-bold">
          {translationOffline("title")}
        </h1>
        <p className="text-center">{translationOffline("message")}</p>
      </div>
    </Layout>
  );
}

export const getStaticProps = getLocaleProps();
