import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";

import errorImage from "~/assets/error-page-image.png";

interface ErrorProps {
  statusCode: number | undefined;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <>
      <Head>
        <title>Weather.io - Error</title>
      </Head>
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Image src={errorImage} alt="Error" />
        <p className="text-3xl font-bold">Error: We are sorry</p>
        <p>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </p>
      </div>
    </>
  );
};

Error.getInitialProps = async ({
  res,
  err,
}: NextPageContext): Promise<ErrorProps> => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
