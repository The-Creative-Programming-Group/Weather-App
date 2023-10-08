import React, { useEffect, useRef } from "react";
import Layout from "~/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const ContactUs = () => {
  const { t: translationContact } = useTranslation("contact");
  const { t: translationCommon } = useTranslation("common");

  const [sendButtonText, setSendButtonText] = React.useState<string>(
    translationContact("send button"),
  );
  const sendButtonTextRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  });

  useEffect(() => {
    if (sendButtonTextRef.current == undefined) return;
    if (sendButtonText === translationContact("send button")) return;
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
      <Layout title={translationCommon("menu contact")}>
        <div className="flex w-full flex-col items-center">
          <h1 className="mt-10 flex justify-center text-4xl font-bold">
            {translationCommon("menu contact")}
          </h1>
          <hr className="mt-3 h-1.5 w-6/12 rounded bg-[#2d3142] md:w-4/12" />
          <div className="mb-2 ml-5 mr-5 mt-5 flex flex-col md:w-1/3 md:flex-row">
            <div className="mb-2 flex w-60 flex-col md:mb-0 md:mr-4 md:w-full">
              <label className="ml-2">{translationContact("first name")}</label>
              <input
                className="h-10 w-full rounded-md bg-[#d7d5db] pl-2"
                onChange={() =>
                  setSendButtonText(translationContact("send button"))
                }
                // Autofocus didn't work, so I used this instead
                ref={inputRef}
                title="Search"
              />
            </div>
            <div className="flex w-60 flex-col md:w-full">
              <label className="ml-2">{translationContact("last name")}</label>
              <input
                className="h-10 w-full rounded-md bg-[#d8d5db] pl-2"
                onChange={() =>
                  setSendButtonText(translationContact("send button"))
                }
              />
            </div>
          </div>
          <div className="mb-2 flex w-60 flex-col md:w-4/12">
            <label className="ml-2">{translationContact("email")}</label>
            <input
              className="h-10 w-full rounded-md bg-[#d8d5db] pl-2"
              onChange={() =>
                setSendButtonText(translationContact("send button"))
              }
            />
          </div>
          <div className="mb-8 flex w-60 flex-col md:w-4/12">
            <label className="ml-2">{translationContact("message")}</label>
            <textarea
              className="h-64 w-full resize-none rounded-md bg-[#d8d5db] pl-2"
              onChange={() =>
                setSendButtonText(translationContact("send button"))
              }
            />
          </div>
          <button
            className="h-9 w-60 rounded border-solid bg-[#2d3142] font-bold text-white"
            onClick={() => setSendButtonText(translationContact("sent button"))}
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
      ...(await serverSideTranslations(locale, ["contact", "common"])),
    },
  };
}

export default ContactUs;
