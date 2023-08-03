import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const Search = () => {
  const searchFocusRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (searchFocusRef.current == undefined) return;
    searchFocusRef.current.focus();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <>
      <Head>
        <title>{"Search - Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src="/assets/background.png"
        alt="background"
        className="absolute w-full h-full -z-10 object-cover"
        width={56}
        height={56}
      />
      <div
        id="styles-setup"
        className="mt-32 absolute w-full flex justify-center"
      >
        <Image
          className="transform bg-[#383b53] border-solid border-[#2d3142] border-8 border-r-0 pt-3 pb-3 pl-3 w-12"
          src="/assets/search1.png"
          alt="search-icon"
          width={56}
          height={56}
        />
        <input
          className="w-5/12 bg-[#383b53] border-solid border-[#2d3142] border-8 border-l-0 pt-0.5 pb-0.5 outline-0 text-xl pl-3 text-white"
          placeholder="Search for your location"
          type="text"
          // Autofocus didn't work, so I used useRef() to focus the input field
          ref={searchFocusRef}
          onChange={handleInputChange}
        />
      </div>
      <div className="absolute mt-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 h-4/6 border-solid border-[#2d3142] border-8">
        <iframe
          id="map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5125429.316419938!2d10.415039000000002!3d51.151785999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1679694749290!5m2!1sde!2sde"
          width="600"
          height="450"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
        {searchInput.length > 0 ? (
          <button className="absolute z-30 bottom-14 right-16 w-40 h-10 text-white bg-[#2d3142] rounded text-2xl hover:shadow-2xl transition duration-500 ease-in-out">
            <Link href="/home">{"Continue ->"}</Link>
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Search;
