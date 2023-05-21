import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Weather.io</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <img
        src="assets/background.png"
        alt="background"
        className="absolute w-full h-full -z-10 object-cover"
      />
      <div className="relative flex flex-col items-center justify-center h-screen gap-12">
        <h1 className="text-8xl">Weather.io</h1>
        <Link href="/search" className="px-5 py-4 mt-4 text-white bg-[#2d3142] rounded-lg text-4xl hover:shadow-2xl transition duration-500 ease-in-out">
            Find your location
        </Link>
      </div>
    </>
  );
};

export default Home;
