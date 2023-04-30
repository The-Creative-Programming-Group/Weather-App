import React from "react";
import Head from "next/head";

const Search = () => {
  return (
    <>
      <Head>
        <title>{"Search - Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <img
        src="assets/background.png"
        alt="background"
        className="absolute w-full h-full -z-10 object-cover"
      />
      <div
        id="styles-setup"
        className="mt-32 absolute w-full flex justify-center"
      >
        <img
          className="transform bg-[#383b53] border-solid border-[#2d3142] border-8 border-r-0 pt-3 pb-3 pl-3 w-12"
          src="assets/search.png"
          alt="search-icon"
          width={56}
          height={56}
        />
        <input
          className="w-5/12 bg-[#383b53] border-solid border-[#2d3142] border-8 border-l-0 pt-0.5 pb-0.5 outline-0 text-xl pl-3 text-white"
          placeholder="Search for your location"
          type="text"
        />
      </div>
      <iframe
        id="map"
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5125429.316419938!2d10.415039000000002!3d51.151785999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1679694749290!5m2!1sde!2sde"
        width="600"
        height="450"
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute mt-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 h-4/6 border-solid border-[#2d3142] border-12"
      ></iframe>
    </>
  );
};

export default Search;
