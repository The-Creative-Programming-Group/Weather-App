import React from "react";
import Head from "next/head";
import { IoIosSettings, IoMdContact } from "react-icons/io";
import { FaMapMarkedAlt, FaShare } from "react-icons/fa";
import { AiFillGithub, AiFillHome } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import dicsiluksProfile from "~/assets/dicsiluks-profile.webp";
import jakobProfile from "~/assets/jakob-profile.webp";
import fabiusProfile from "~/assets/fabius-profile.jpg";
import jakeProfile from "~/assets/jake-profile.png";
import { useTranslation } from "next-i18next";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  footer?: "white" | "normal";
}

/* If you use this component,
   you have to add the i18n translation SSR stuff to the getStaticProps function of the page
   you use this component in. */
const Layout: React.FC<LayoutProps> = ({ title, children, footer }) => {
  const { t: translation } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{title ? title + " - Weather.io" : "Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
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
      {footer == "white" ? (
        <footer className="absolute flex h-24 w-full items-center bg-[#adacb5] text-xl text-black">
          <div className="ml-5 w-52">© - Weather.io</div>
          <Link href="https://github.com/The-Creative-Programming-Group/Weather-App">
            <AiFillGithub className="ml-5 text-3xl transition duration-500 ease-in-out hover:text-gray-400" />
          </Link>
          <div className="mr-72 flex w-full justify-center">
            {" "}
            <Link href="/legal" className="flex justify-center underline">
              {translation("footer legal")}
            </Link>
          </div>
          <div className="absolute right-0 mr-12 flex w-1/4 items-center justify-between">
            <div className="w-28 text-sm">Made with ♥️ by</div>
            <div className="flex flex-col items-center">
              <Link
                href="https://www.roessner.tech"
                className="group relative inline-block"
              >
                <Image
                  src={jakobProfile}
                  alt="Jakob's logo"
                  width="50"
                  height="50"
                  className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm">Founder</p>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <Link
                href="https://github.com/dicsiluks"
                className="group relative inline-block"
              >
                <Image
                  src={dicsiluksProfile}
                  alt="dicsiluks' logo"
                  width="50"
                  height="50"
                  className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm">Designer</p>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <Link
                href="https://www.schurig.tech"
                className="group relative inline-block"
              >
                <Image
                  src={fabiusProfile}
                  alt="Fabius' logo"
                  width="50"
                  height="50"
                  className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm">Engineer</p>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <Link
                href="https://github.com/dongjin2008"
                className="group relative inline-block"
              >
                <Image
                  src={jakeProfile}
                  alt="Jake's logo"
                  width="50"
                  height="50"
                  className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-center text-sm">Designer & Engineer</p>
            </div>
          </div>
        </footer>
      ) : (
        <footer className="absolute flex h-24 w-full items-center bg-[#2d3142] text-xl text-white">
          <div className="ml-5 w-52">© - Weather.io</div>
          <Link href="https://github.com/The-Creative-Programming-Group/Weather-App">
            <AiFillGithub className="ml-5 text-3xl transition duration-500 ease-in-out hover:text-gray-400" />
          </Link>
          <div className="mr-72 flex w-full justify-center">
            {" "}
            <Link href="/legal" className="flex justify-center underline">
              {translation("footer legal")}
            </Link>
          </div>
          <div className="absolute right-0 mr-12 flex w-1/4 items-center justify-between">
            <div className="w-28 text-sm">Made with ♥️ by</div>
            <div className="flex flex-col items-center">
              <Link
                href="https://www.roessner.tech"
                className="group relative inline-block"
              >
                <Image
                  src={jakobProfile}
                  alt="Jakob's logo"
                  width="50"
                  height="50"
                  className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm">Founder</p>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <Link
                href="https://github.com/dicsiluks"
                className="group relative inline-block"
              >
                <Image
                  src={dicsiluksProfile}
                  alt="dicsiluks' logo"
                  width="50"
                  height="50"
                  className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm">Designer</p>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <Link
                href="https://www.schurig.tech"
                className="group relative inline-block"
              >
                <Image
                  src={fabiusProfile}
                  alt="Fabius' logo"
                  width="50"
                  height="50"
                  className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm">Engineer</p>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <Link
                href="https://github.com/dongjin2008"
                className="group relative inline-block"
              >
                <Image
                  src={jakeProfile}
                  alt="Jake's logo"
                  width="50"
                  height="50"
                  className="transform rounded-full transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-center text-sm">Designer & Engineer</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Layout;
