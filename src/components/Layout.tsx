import React, { useState } from "react";
import Head from "next/head";
import { IoIosSettings, IoMdContact } from "react-icons/io";
import { FaMapMarkedAlt, FaShare } from "react-icons/fa";
import { AiFillGithub, AiFillHome } from "react-icons/ai";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

/* If you use this component,
   you have to add the i18n translation SSR stuff to the getStaticProps function of the page
   you use this component in. */
const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const { t: translation } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{title ? title + " - Weather.io" : "Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content="/_next/image?url=%2Fog-image.png&w=640&q=75"
        />
      </Head>
      <header className="hidden items-center justify-around bg-[#2d3142] p-2 text-white md:flex">
        <Link href="/home" className="flex">
          <AiFillHome className="mr-1.5 text-2xl" />
          <p>{translation("menu home")}</p>
        </Link>
        <Link href="/locationsettings" className="flex">
          <FaMapMarkedAlt className="mr-1.5 text-2xl" />
          <p>{translation("menu locations")}</p>
        </Link>
        <h1 className="text-base font-semibold md:text-4xl md:font-normal">
          <Link href="/home">Weather.io</Link>
        </h1>
        <Link href="/settings" className="flex">
          <IoIosSettings className="mr-1.5 text-2xl" />{" "}
          <p>{translation("menu settings")}</p>
        </Link>
        <Link href="/contact" className="flex">
          <IoMdContact className="mr-1.5 text-2xl" />
          <p>{translation("menu contact")}</p>
        </Link>
      </header>
      <header className="bg-[#2d3142] p-2 text-white md:hidden">
        <div className="flex items-center">
          {!navbarOpen && <Menu onClick={() => setNavbarOpen(true)} />}
          {navbarOpen && <X onClick={() => setNavbarOpen(false)} />}
          <h1 className="ml-2.5 text-base font-semibold">
            <Link href="/home">Weather.io</Link>
          </h1>
        </div>
        {navbarOpen && (
          <div className="z-10 flex flex-col gap-2">
            <Link href="/home" className="mt-2 flex">
              <AiFillHome className="mr-1.5" />
              <p>{translation("menu home")}</p>
            </Link>
            <Link href="/locationsettings" className="mt-2 flex items-center">
              <FaMapMarkedAlt className="mr-1.5" />
              <p>{translation("menu locations")}</p>
            </Link>
            <Link href="/settings" className="mt-2 flex items-center">
              <IoIosSettings className="mr-1.5" />{" "}
              <p>{translation("menu settings")}</p>
            </Link>
            <Link href="/contact" className="mt-2 flex items-center">
              <IoMdContact className="mr-1.5" />
              <p>{translation("menu contact")}</p>
            </Link>
          </div>
        )}
        <button className="absolute right-16 mt-36 flex rounded bg-[#2d3142] p-2 text-amber-50">
          {" "}
          <FaShare className="mr-1.5 mt-1" /> {translation("share button")}
        </button>
      </header>
      <main className="min-h-screen">{children}</main>
      <footer className="flex h-24 w-full items-center justify-between bg-[#2d3142] text-base text-white md:text-xl">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="ml-2">© - Weather.io</div>
          <Link href="https://github.com/The-Creative-Programming-Group/Weather-App">
            <AiFillGithub className="text-3xl transition duration-500 ease-in-out hover:text-gray-400" />
          </Link>
        </div>
        <div className="mr-2 flex flex-col gap-2 md:w-96 md:flex-row md:justify-between">
          <div className="flex justify-center">
            {" "}
            <Link href="/legal" className="flex justify-center underline">
              {translation("footer legal")}
            </Link>
          </div>
          <div className="flex justify-center">
            {" "}
            <Link
              href="/contributors"
              className="flex justify-center underline"
            >
              {translation("footer contributors")}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
