import Layout from "~/components/Layout";
import { getLocaleProps, useScopedI18n } from "../locales";

// For more information about 404 page, please visit https://nextjs.org/docs/pages/building-your-application/routing/custom-error#404-page
export default function Custom404() {
  const translation404 = useScopedI18n("404");
  const translationCommon = useScopedI18n("common");

  return (
    <Layout title={translationCommon("title 404 page")}>
      <div className="flex w-full flex-col items-center">
        <h1 className="mt-10 text-center text-4xl font-bold">
          {translation404("title")}
        </h1>
      </div>
    </Layout>
  );
}

export const getStaticProps = getLocaleProps();
