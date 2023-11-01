import React from "react";
import Head from "next/head";
import { IoIosSettings, IoMdContact } from "react-icons/io";
import { FaMapMarkedAlt, FaShare } from "react-icons/fa";
import { AiFillGithub, AiFillHome } from "react-icons/ai";
import Link from "next/link";
import { useTranslation } from "next-i18next";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/* If you use this component,
   you have to add the i18n translation SSR stuff to the getStaticProps function of the page
   you use this component in. */
const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const { t: translation } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{title ? title + " - Weather.io" : "Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content={`${getBaseUrl()}/_next/image?url=%2Fog-image.png&w=640&q=75`}
        />
      </Head>
      <header className="flex items-center justify-around bg-[#2d3142] p-2 text-white">
        <Link href="/home" className="flex">
          <AiFillHome className="mr-1.5 md:text-2xl" />
          <p>{translation("menu home")}</p>
        </Link>
        <Link href="/locationsettings" className="flex">
          <FaMapMarkedAlt className="mr-1.5 md:text-2xl" />
          <p>{translation("menu locations")}</p>
        </Link>
        <h1 className="text-base font-semibold md:text-4xl md:font-normal">
          <Link href="/home">Weather.io</Link>
        </h1>
        <Link href="/settings" className="flex">
          <IoIosSettings className="mr-1.5 md:text-2xl" />{" "}
          <p>{translation("menu settings")}</p>
        </Link>
        <Link href="/contact" className="flex">
          <IoMdContact className="mr-1.5 md:text-2xl" />
          <p>{translation("menu contact")}</p>
        </Link>
      </header>
      <main className="min-h-screen">
        <div>
          <button className="absolute right-16 top-36 flex rounded bg-[#2d3142] p-2 text-amber-50">
            {" "}
            <FaShare className="mr-1.5 mt-1" /> {translation("share button")}
          </button>
        </div>
        {children}
      </main>
      <footer className="absolute flex h-24 w-full items-center justify-between bg-[#2d3142] text-xl text-white">
        <div className="flex gap-4">
          <div className="ml-2">© - Weather.io</div>
          <Link href="https://github.com/The-Creative-Programming-Group/Weather-App">
            <AiFillGithub className="text-3xl transition duration-500 ease-in-out hover:text-gray-400" />
          </Link>
        </div>
        <div className="flex justify-center">
          {" "}
          <Link href="/legal" className="flex justify-center underline">
            {translation("footer legal")}
          </Link>
        </div>
        <div className="mr-2 flex justify-center">
          {" "}
          <Link href="/contributors" className="flex justify-center underline">
            {translation("footer contributors")}
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Layout;
