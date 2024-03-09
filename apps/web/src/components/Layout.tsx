import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { AiFillGithub, AiFillHome } from "react-icons/ai";
import { FaMapMarkedAlt, FaShare } from "react-icons/fa";
import { IoIosSettings, IoMdContact } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { LuMenu, LuX } from "react-icons/lu";
import { PiScrollFill } from "react-icons/pi";

import { cn } from "@weatherio/ui";

import { useScopedI18n } from "~/locales";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  classNameShareButton?: string;
  page?: "home" | "locationsettings" | "settings" | "contact";
}

declare global {
  interface Window {
    MSStream: unknown;
  }
}

/* If you use this component,
   you have to add the i18n translation SSR stuff to the getStaticProps function of the page
   you use this component in. */
const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  classNameShareButton,
  page,
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const translation = useScopedI18n("common");

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
  }, []);

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
            <p className={cn({ underline: page === "home" })}>
              {translation("menu home")}
            </p>
          </Link>
          <Link href="/locationsettings" className="flex">
            <FaMapMarkedAlt className="mr-1.5 text-2xl" />
            <p className={cn({ underline: page === "locationsettings" })}>
              {translation("menu locations")}
            </p>
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
            <p className={cn({ underline: page === "settings" })}>
              {translation("menu settings")}
            </p>
          </Link>
          <Link href="/contact" className="flex">
            <IoMdContact className="mr-1.5 text-2xl" />
            <p className={cn({ underline: page === "contact" })}>
              {translation("menu contact")}
            </p>
          </Link>
        </div>
      </header>
      <header className="bg-[#2d3142] p-2 text-white md:hidden">
        <div className="flex items-center">
          {!navbarOpen && (
            <LuMenu onClick={() => setNavbarOpen(true)} className="h-6 w-6" />
          )}
          {navbarOpen && (
            <LuX onClick={() => setNavbarOpen(false)} className="h-6 w-6" />
          )}
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
            <Link
              href="https://github.com/The-Creative-Programming-Group/Weather-App"
              aria-label="Link to the GitHub Repo of this Website"
              className="mt-2 flex items-center"
            >
              <AiFillGithub className="mr-1.5" />
              <p>GitHub</p>
            </Link>
            <Link href="/legal" className="mt-2 flex items-center">
              <PiScrollFill className="mr-1.5" />
              <p>{translation("footer legal")}</p>
            </Link>
            <Link href="/contributors" className="mt-2 flex items-center">
              <IoPeopleSharp className="mr-1.5" />
              <p>{translation("footer contributors")}</p>
            </Link>
          </div>
        )}
      </header>
      <div className={"mt-10 flex justify-center"}>
        <button
          className={cn(
            "flex rounded border-2 border-black bg-[#2d3142] p-2 text-amber-50 md:right-16",
            classNameShareButton,
          )}
          onClick={handleShare}
        >
          {" "}
          <FaShare className="mr-1.5 mt-1" /> {translation("share button")}
        </button>
      </div>
      <main className="mb-14 min-h-screen md:mb-0">{children}</main>
      <div
        className={cn(
          "fixed bottom-0 left-0 z-50 block h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700 md:hidden",
          // This is needed because of the iOS bottom bar which is always visible and overlaps the menu bar
          {
            "h-24 pb-8": isIOS,
          },
        )}
      >
        <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
          <Link
            href="/home"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 text-gray-500",
              {
                "text-blue-600": page === "home",
              },
            )}
          >
            <AiFillHome className="mb-2 h-7 w-7" aria-hidden="true" />
            <span className="text-sm">{translation("menu home")}</span>
          </Link>
          <Link
            href="/locationsettings"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 text-gray-500",
              {
                "text-blue-600": page === "locationsettings",
              },
            )}
          >
            <FaMapMarkedAlt className="mb-2 h-7 w-7" aria-hidden="true" />
            <span className="text-sm">{translation("menu locations")}</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 text-gray-500",
              {
                "text-blue-600": page === "settings",
              },
            )}
          >
            <IoIosSettings className="mb-2 h-7 w-7 " aria-hidden="true" />
            <span className="text-sm">{translation("menu settings")}</span>
          </Link>
          <Link
            href="/contact"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 text-gray-500",
              {
                "text-blue-600": page === "contact",
              },
            )}
          >
            <IoMdContact className="mb-2 h-7 w-7" aria-hidden="true" />
            <span className="text-sm">{translation("menu contact")}</span>
          </Link>
        </div>
      </div>
      <footer className="hidden h-24 w-full items-center justify-between bg-[#2d3142] pr-2 text-base text-white md:flex md:text-xl">
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
