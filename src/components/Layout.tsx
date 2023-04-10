import React from "react";
import Head from "next/head";
import styles from "./styles-layout.module.css";
import Link from "next/link";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? title + " - Weather.io" : "Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-[#ddc3c3] p-2 flex justify-around items-center">
        <a className={styles.navbarA} href="#">
          Home
        </a>
        <a className={styles.navbarA}>Location Settings</a>
        <h1 className="text-base font-semibold md:font-normal md:text-4xl">
          Weather.io
        </h1>
        <Link className={styles.navbarA} href="/settings">
          Settings
        </Link>
        <a className={styles.navbarA}>Contact Us</a>
      </header>
      <main className="bg-[#ffe5e5] min-h-screen">{children}</main>
      <footer className="absolute w-full pt-8 bg-[#ddc3c3]">
        <div className="mb-3 ml-3">© - Weather.io</div>
      </footer>
    </>
  );
}
