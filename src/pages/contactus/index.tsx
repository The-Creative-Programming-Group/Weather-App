import React, { useEffect, useRef } from "react";
import Layout from "~/components/Layout";

const ContactUs = () => {
  type SendButtonTextType = "Send" | "Sent";
  const [sendButtonText, setSendButtonText] =
    React.useState<SendButtonTextType>("Send");
  const sendButtonTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sendButtonTextRef.current == undefined) return;
    if (sendButtonText === "Send") return;
    sendButtonTextRef.current.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: 500,
      }
    );
  }, [sendButtonText]);

  return (
    <>
      <Layout title={"Contact Us"}>
        <div className="flex flex-col items-center w-full">
          <h1 className="flex mt-10 justify-center text-3xl font-bold">
            Contact Us
          </h1>
          <hr className="w-4/12 h-1.5 bg-[#2d3142] mt-3 rounded" />
          <div className="flex flex-col md:flex-row mt-5 ml-5 mr-5 mb-2 md:w-1/3">
            <div className="flex flex-col w-60 md:w-full md:mr-4 md:mb-0 mb-2">
              <label className="ml-2">First name</label>
              <input
                className="bg-[#d7d5db] h-10 rounded-md w-full pl-2"
                onChange={() => setSendButtonText("Send")}
              />
            </div>
            <div className="flex flex-col w-60 md:w-full">
              <label className="ml-2">Last name</label>
              <input
                className="bg-[#d8d5db] h-10 rounded-md w-full pl-2"
                onChange={() => setSendButtonText("Send")}
              />
            </div>
          </div>
          <div className="flex flex-col w-60 md:w-4/12 mb-2">
            <label className="ml-2">Email</label>
            <input
              className="bg-[#d8d5db] h-10 rounded-md pl-2 w-full"
              onChange={() => setSendButtonText("Send")}
            />
          </div>
          <div className="flex flex-col w-60 md:w-4/12 mb-8">
            <label className="ml-2">Message</label>
            <textarea
              className="bg-[#d8d5db] h-64 rounded-md w-full resize-none pl-2"
              onChange={() => setSendButtonText("Send")}
            />
          </div>
          <button
            className="bg-[#2d3142] w-60 h-9 border-solid rounded text-white"
            onClick={() => setSendButtonText("Sent")}
          >
            <div ref={sendButtonTextRef}>{sendButtonText}</div>
          </button>
        </div>
      </Layout>
    </>
  );
};

export default ContactUs;
