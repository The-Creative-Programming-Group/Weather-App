import React, { useState } from "react";
import Head from "next/head";
import { IoIosSettings, IoMdContact } from "react-icons/io";
import { FaMapMarkedAlt, FaShare } from "react-icons/fa";
import { AiFillGithub, AiFillHome } from "react-icons/ai";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Menu, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  classNameShareButton?: string;
}

/* If you use this component,
   you have to add the i18n translation SSR stuff to the getStaticProps function of the page
   you use this component in. */
const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  classNameShareButton,
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const { t: translation } = useTranslation("common");

  const handleShare = () => {
    const title = document.title;
    const url = window.location.href;
    const text = translation("share text"); // Replace this with your specific text

    if (navigator.share) {
      try {
        void navigator.share({ title, text, url });
      } catch (error) {
        console.error("Something went wrong sharing the page", error);
      }
    } else {
      console.log("Web Share API is not supported in your browser");
    }
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - Weather.io" : "Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <meta
          property="og:image"
          content="/_next/image?url=%2Fog-image.png&w=640&q=75"
        />
      </Head>
      <header className="hidden items-center justify-around bg-[#2d3142] p-2 text-white md:flex">
        <div className="flex w-3/5 max-w-3xl justify-around">
          <Link href="/home" className="flex">
            <AiFillHome className="mr-1.5 text-2xl" />
            <p>{translation("menu home")}</p>
          </Link>
          <Link href="/locationsettings" className="flex">
            <FaMapMarkedAlt className="mr-1.5 text-2xl" />
            <p>{translation("menu locations")}</p>
          </Link>
        </div>
        <Link href="/home" className="flex flex-col items-center">
          <h1 className="text-base font-semibold md:text-2xl md:font-normal">
            {translation("title")}
          </h1>
          <p>{translation("location")}</p>
        </Link>
        <div className="flex w-3/5 max-w-3xl justify-around">
          <Link href="/settings" className="flex">
            <IoIosSettings className="mr-1.5 text-2xl" />{" "}
            <p>{translation("menu settings")}</p>
          </Link>
          <Link href="/contact" className="flex">
            <IoMdContact className="mr-1.5 text-2xl" />
            <p>{translation("menu contact")}</p>
          </Link>
        </div>
      </header>
      <header className="bg-[#2d3142] p-2 text-white md:hidden">
        <div className="flex items-center">
          {!navbarOpen && <Menu onClick={() => setNavbarOpen(true)} />}
          {navbarOpen && <X onClick={() => setNavbarOpen(false)} />}
          <Link
            href="/home"
            className="ml-2.5 flex flex-col items-center text-xl font-semibold"
          >
            <h1>{translation("title")}</h1>
            <p className="text-sm font-normal">{translation("location")}</p>
          </Link>
        </div>
        {navbarOpen && (
          <div className="z-10 mt-2 flex w-full flex-col gap-2 whitespace-nowrap border-t-2">
            <Link href="/home" className="mt-2 flex items-center">
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
      </header>
      <button
        className={cn(
          "absolute right-5 mt-28 flex rounded border-2 border-black bg-[#2d3142] p-2 text-amber-50 md:right-16",
          classNameShareButton,
        )}
        onClick={handleShare}
      >
        {" "}
        <FaShare className="mr-1.5 mt-1" /> {translation("share button")}
      </button>
      <main className="min-h-screen">{children}</main>
      <footer className="flex h-24 w-full items-center justify-between bg-[#2d3142] pr-2 text-base text-white md:text-xl">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="ml-2">© - Weather.io</div>
          <Link
            href="https://github.com/The-Creative-Programming-Group/Weather-App"
            aria-label="Link to the GitHub Repo of this Website"
          >
            <AiFillGithub className="text-3xl transition duration-500 ease-in-out hover:text-gray-400" />
          </Link>
        </div>
        <div className="flex flex-col gap-2 md:w-96 md:flex-row md:justify-between">
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
