import React from "react";
import Head from "next/head";
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
      <header className="bg-[#2d3142] p-2 flex justify-around items-center text-white">
        <Link href="/home">Home</Link>
        <Link href="/locationsettings">Location settings</Link>
        <h1 className="text-base font-semibold md:font-normal md:text-4xl">
          <Link href="/home">Weather.io</Link>
        </h1>
        <Link href="/settings">Settings</Link>
        <Link href="/contact">Contact</Link>
      </header>
      <main className="min-h-screen">{children}</main>
      {footer == "white" ? (
        <footer className="absolute w-full pt-8 bg-[#adacb5] text-black text-2xl">
          <div className="mb-3 ml-3">© - Weather.io</div>
        </footer>
      ) : (
        <footer className="absolute w-full pt-8 bg-[#2d3142] text-white text-2xl">
          <div className="mb-3 ml-3">© - Weather.io</div>
        </footer>
      )}
    </>
  );
};

export default Layout;
