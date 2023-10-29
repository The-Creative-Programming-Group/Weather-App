import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import background from "~/assets/background.png";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const PublicHome: NextPage = () => {
  const { t: translation } = useTranslation("common");

  return (
    <>
      <Head>
        <title>Weather.io</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content="https://weatherio1.vercel.app/_next/image?url=%2Fog-image.png&w=640&q=75"
        />
      </Head>
      <Image
        src={background}
        alt="background"
        className="absolute -z-10 h-full w-full object-cover"
        fill
      />
      <div className="relative flex h-screen flex-col items-center justify-center gap-12">
        <h1 className="text-8xl">Weather.io</h1>
        <Link
          href="/search"
          className="mt-4 rounded-lg bg-[#2d3142] px-5 py-4 text-4xl text-white transition duration-500 ease-in-out hover:shadow-2xl"
        >
          {translation("start button")}
        </Link>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default PublicHome;
