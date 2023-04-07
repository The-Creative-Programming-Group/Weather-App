import React from "react";
import Head from "next/head";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? title + " - Weather.io" : "Weather.io"}</title>
        <meta name="description" content="An faboulus E-Commerce website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-[#ddc3c3] p-2 flex justify-around items-center">
        <a className="no-underline text-black text-xs md:text-base" href="#">
          Home
        </a>
        <a className="no-underline text-black text-xs md:text-base">
          Location Settings
        </a>
        <h1 className="text-base font-semibold md:font-normal md:text-4xl">
          Weather.io
        </h1>
        <a className="no-underline text-black text-xs md:text-base">Settings</a>
        <a className="no-underline text-black text-xs md:text-base">
          Contact Us
        </a>
      </header>
      <main className="min-h-screen">{children}</main>
      <footer className="absolute w-full pt-8 bg-[#ddc3c3]">
        <div className="mb-3 ml-3">© - Weather.io</div>
      </footer>
    </>
  );
}
