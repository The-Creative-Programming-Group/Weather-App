import React from "react";
import Head from "next/head";
import { IoIosSettings, IoMdContact } from "react-icons/io";
import Link from "next/link";

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
        <Link href="/home">Home</Link>
        <Link href="/locationsettings">Location settings</Link>
        <h1 className="text-base font-semibold md:text-4xl md:font-normal">
          <Link href="/home">Weather.io</Link>
        </h1>
        <Link href="/settings" className={"flex"}>
          {" "}
          <IoIosSettings className="mr-1.5 mt-0.5 md:text-2xl" />{" "}
          <p className={"mt-0.2"}>Settings</p>
        </Link>
        <Link href="/contact" className={"flex"}>
          <IoMdContact className={"mr-1.5 mt-0.5 md:text-2xl"} />
          <p className={"mt-0.2"}>Contact</p>
        </Link>
      </header>
      <main className="min-h-screen">{children}</main>
      {footer == "white" ? (
        <footer className="absolute w-full bg-[#adacb5] pt-8 text-2xl text-black">
          <div className="mb-3 ml-3">© - Weather.io</div>
        </footer>
      ) : (
        <footer className="absolute w-full bg-[#2d3142] pt-8 text-2xl text-white">
          <div className="mb-3 ml-3">© - Weather.io</div>
        </footer>
      )}
    </>
  );
};

export default Layout;
