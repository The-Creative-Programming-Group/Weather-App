import React from "react";
import Head from "next/head";
import { IoIosSettings, IoMdContact } from "react-icons/io";
import { FaMapMarkedAlt } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import dicsiluksProfile from "~/assets/dicsiluks-profile.webp";
import jakobProfile from "~/assets/jakob-profile.png";
import fabiusProfile from "~/assets/fabius-profile.jpg";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  footer?: "white" | "normal";
}

const Layout: React.FC<LayoutProps> = ({ title, children, footer }) => {
  return (
    <>
      <Head>
        <title>{title ? title + " - Weather.io" : "Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex items-center justify-around bg-[#2d3142] p-2 text-white">
        <Link href="/home" className="flex">
          <AiFillHome className="mr-1.5 mt-0.5 md:text-2xl" />
          <p className="mt-0.2">Home</p>
        </Link>
        <Link href="/locationsettings" className="flex">
          <FaMapMarkedAlt className="mr-1.5 mt-0.5 md:text-2xl" />
          <p className="mt-0.2">Location settings</p>
        </Link>
        <h1 className="text-base font-semibold md:text-4xl md:font-normal">
          <Link href="/home">Weather.io</Link>
        </h1>
        <Link href="/settings" className="flex">
          {" "}
          <IoIosSettings className="mr-1.5 mt-0.5 md:text-2xl" />{" "}
          <p className="mt-0.2">Settings</p>
        </Link>
        <Link href="/contact" className="flex">
          <IoMdContact className="mr-1.5 mt-0.5 md:text-2xl" />
          <p className="mt-0.2">Contact</p>
        </Link>
      </header>
      <main className="min-h-screen">{children}</main>
      {footer == "white" ? (
        <footer className="absolute w-full bg-[#adacb5] pt-8 text-xl text-black">
          <div className="mb-3 ml-3">© - Weather.io</div>
        </footer>
      ) : (
        <footer className="absolute w-full bg-[#2d3142] text-xl text-white flex h-20 items-center">
          <div className="ml-3">© - Weather.io</div>
          <div className="absolute mr-12 flex justify-between items-center w-96 right-0">
            <div className="text-sm w-28">Made with ♥️ by</div>
            <div className="flex flex-col items-center">
              <Link href="https://www.roessner.tech">
                <Image
                  src={jakobProfile}
                  alt="jakobs logo"
                  width="50"
                  height="50"
                  className="rounded-full shadow-black hover:shadow-2xl"
                />
              </Link>
              <p className="text-sm">Founder</p>
            </div>
            <div className="flex flex-col items-center ml-6">
              <Link href="https://github.com/dicsiluks">
                <Image
                  src={dicsiluksProfile}
                  alt="dicsiluks logo"
                  width="50"
                  height="50"
                  className="rounded-full shadow-black hover:shadow-2xl"
                />
              </Link>
              <p className="text-sm">Designer</p>
            </div>
            <div className="flex flex-col items-center ml-6">
              <Link href="https://www.schurig.tech">
                <Image
                  src={fabiusProfile}
                  alt="Fabius logo"
                  width="50"
                  height="50"
                  className="rounded-full shadow-black hover:shadow-2xl"
                />
              </Link>
              <p className="text-sm">Engineer</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Layout;
