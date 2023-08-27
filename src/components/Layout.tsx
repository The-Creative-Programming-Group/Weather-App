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
          <AiFillHome className="mr-1.5 md:text-2xl" />
          <p>Home</p>
        </Link>
        <Link href="/locationsettings" className="flex">
          <FaMapMarkedAlt className="mr-1.5 md:text-2xl" />
          <p>Locations</p>
        </Link>
        <h1 className="text-base font-semibold md:text-4xl md:font-normal">
          <Link href="/home">Weather.io</Link>
        </h1>
        <Link href="/settings" className="flex">
          <IoIosSettings className="mr-1.5 md:text-2xl" /> <p>Settings</p>
        </Link>
        <Link href="/contact" className="flex">
          <IoMdContact className="mr-1.5 md:text-2xl" />
          <p>Contact</p>
        </Link>
      </header>
      <main className="min-h-screen">
        <div>
          <button className="top-36 absolute right-16 bg-[#2d3142] text-amber-50 p-2 rounded flex">
            {" "}
            <FaShare className="mr-1.5 mt-1" /> Share
          </button>
        </div>
        {children}
      </main>
      {footer == "white" ? (
        <footer className="absolute w-full bg-[#adacb5] pt-8 text-xl text-black">
          <div className="mb-3 ml-3">© - Weather.io</div>
        </footer>
      ) : (
        <footer className="absolute w-full bg-[#2d3142] text-xl text-white flex h-20 items-center">
          <div className="ml-5 w-52">© - Weather.io</div>
          <Link href="https://github.com/The-Creative-Programming-Group/Weather-App">
            <AiFillGithub className="ml-5 text-3xl hover:text-gray-400 transition duration-500 ease-in-out" />
          </Link>
          <div className="flex justify-center w-full mr-72">
            {" "}
            <Link href="/legal" className="flex justify-center underline">
              Legal
            </Link>
          </div>
          <div className="absolute mr-12 flex justify-between items-center w-96 right-0">
            <div className="text-sm w-28">Made with ♥️ by</div>
            <div className="flex flex-col items-center">
              <Link
                href="https://www.roessner.tech"
                className="relative group inline-block"
              >
                <Image
                  src={jakobProfile}
                  alt="jakobs logo"
                  width="50"
                  height="50"
                  className="rounded-full transition-transform transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm">Founder</p>
            </div>
            <div className="flex flex-col items-center ml-6">
              <Link
                href="https://github.com/dicsiluks"
                className="relative group inline-block"
              >
                <Image
                  src={dicsiluksProfile}
                  alt="dicsiluks logo"
                  width="50"
                  height="50"
                  className="rounded-full transition-transform transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm">Designer</p>
            </div>
            <div className="flex flex-col items-center ml-6">
              <Link
                href="https://www.schurig.tech"
                className="relative group inline-block"
              >
                <Image
                  src={fabiusProfile}
                  alt="Fabius logo"
                  width="50"
                  height="50"
                  className="rounded-full transition-transform transform duration-300 group-hover:-translate-x-2 group-hover:scale-105"
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
