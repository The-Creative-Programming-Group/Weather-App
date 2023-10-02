import React, { useEffect, useRef } from "react";
import Layout from "~/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ContactUs = () => {
  type SendButtonTextType = "Send" | "Sent";
  const [sendButtonText, setSendButtonText] =
    React.useState<SendButtonTextType>("Send");
  const sendButtonTextRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  });

  useEffect(() => {
    if (sendButtonTextRef.current == undefined) return;
    if (sendButtonText === "Send") return;
    sendButtonTextRef.current.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: 500,
      },
    );
  }, [sendButtonText]);

  return (
    <>
      <Layout title="Contact Us">
        <div className="flex w-full flex-col items-center">
          <h1 className="mt-24 flex justify-center text-3xl font-bold">
            Contact Us
          </h1>
          <hr className="mt-3 h-1.5 w-9/12 rounded bg-[#2d3142] md:w-5/12" />
          <div className="mb-2 ml-5 mr-5 mt-5 flex flex-col md:w-1/3 md:flex-row">
            <div className="mb-2 flex w-60 flex-col md:mb-0 md:mr-4 md:w-full">
              <label className="ml-2">First name</label>
              <input
                className="h-10 w-full rounded-md bg-[#d7d5db] pl-2"
                onChange={() => setSendButtonText("Send")}
                // Autofocus didn't work, so I used this instead
                ref={inputRef}
                title="Search"
              />
            </div>
            <div className="flex w-60 flex-col md:w-full">
              <label className="ml-2">Last name</label>
              <input
                className="h-10 w-full rounded-md bg-[#d8d5db] pl-2"
                onChange={() => setSendButtonText("Send")}
              />
            </div>
          </div>
          <div className="mb-2 flex w-60 flex-col md:w-4/12">
            <label className="ml-2">Email</label>
            <input
              className="h-10 w-full rounded-md bg-[#d8d5db] pl-2"
              onChange={() => setSendButtonText("Send")}
            />
          </div>
          <div className="mb-8 flex w-60 flex-col md:w-4/12">
            <label className="ml-2">Message</label>
            <textarea
              className="h-64 w-full resize-none rounded-md bg-[#d8d5db] pl-2"
              onChange={() => setSendButtonText("Send")}
            />
          </div>
          <button
            className="h-9 w-60 rounded border-solid bg-[#2d3142] font-bold text-white"
            onClick={() => setSendButtonText("Sent")}
          >
            <div ref={sendButtonTextRef}>{sendButtonText}</div>
          </button>
        </div>
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default ContactUs;
