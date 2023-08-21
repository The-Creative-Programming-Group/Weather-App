import React from "react";
import Layout from "~/components/Layout";

const legal = () => {
  return (
    <>
      <Layout title="Impressum">
        <div className="flex flex-col items-center w-full mt-10">
          <p className="font-bold text-3xl">Legal Notice</p>
          <p className="mt-2.5">
            Information according to § 5 TMG (Telemedia Act)
          </p>
          <p className="mt-1">Jakob Rössner</p>
          <p className="mt-1">+49 1512 5404979</p>
          <p className="mt-1">15755, Teupitz ST Tornow, Germany</p>
          <p className="ml-14 mt-14">
            The contents of this website have been carefully reviewed and
            created. <br />
            However, we do not guarantee the accuracy, completeness, <br /> and
            timeliness of the provided information. <br />
            We are not liable for damages or losses arising from the use of this
            website. <br />
            The operators of linked pages are solely responsible for their
            content. <br />
            Any liability for external content is expressly excluded.
          </p>
        </div>
      </Layout>
    </>
  );
};

export default legal;
