import React, { useEffect, useRef, useState } from "react";
import Layout from "~/components/Layout";
import styles from "./settings.module.css";
import {
  temperatureUnit$,
  type TemperatureUnitType,
  windSpeedUnit$,
  type WindSpeedUnitType,
} from "~/states";
import { observer } from "@legendapp/state/react-components";
import { RxCheck } from "react-icons/rx";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Settings = observer(() => {
  const doneImage = "/assets/done.png";

  const handleTemperatureUnitClick = (unit: TemperatureUnitType) => {
    temperatureUnit$.set(unit);
  };
  const handleSpeedUnitClick = (unit: WindSpeedUnitType) => {
    windSpeedUnit$.set(unit);
  };

  const normalButtonClass = styles.normalbutton ? styles.normalbutton : "";

  return (
    <>
      <Layout title="Settings">
        <div className="flex w-full flex-col items-center">
          <h1 className="mt-10 flex justify-center text-4xl font-bold">
            Settings
          </h1>
          <hr className="mt-9 h-1.5 w-4/12 rounded bg-[#2d3142]" />
          <div className="m-5 flex flex-col justify-center">
            <h2 className="text-basic font-bold">Temperature units</h2>
            <button
              className={`${normalButtonClass} ${
                temperatureUnit$.get() === "Celsius" ? "border-2" : ""
              }`}
              onClick={() => handleTemperatureUnitClick("Celsius")}
            >
              <p className={styles.buttontext}>Celsius (°C)</p>
              {temperatureUnit$.get() === "Celsius" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                temperatureUnit$.get() === "Fahrenheit" ? "border-2" : ""
              }`}
              onClick={() => handleTemperatureUnitClick("Fahrenheit")}
            >
              <p className={styles.buttontext}>Fahrenheit (°F)</p>
              {temperatureUnit$.get() === "Fahrenheit" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
          </div>

          <div className="m-5 flex flex-col justify-center">
            <h2 className="text-basic font-bold">Wind speed units</h2>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "Miles per hour" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Miles per hour")}
            >
              <p className={styles.buttontext}>Miles per hour (mph)</p>
              {windSpeedUnit$.get() === "Miles per hour" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "Kilometers per hour" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Kilometers per hour")}
            >
              <p className={styles.buttontext}>Kilometers per hour (km/h)</p>
              {windSpeedUnit$.get() === "Kilometers per hour" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "Knots" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Knots")}
            >
              <p className={styles.buttontext}>Knots</p>
              {windSpeedUnit$.get() === "Knots" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "Meters per second" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Meters per second")}
            >
              <p className={styles.buttontext}>Meters per second (m/s)</p>
              {windSpeedUnit$.get() === "Meters per second" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "Beaufort" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Beaufort")}
            >
              <p className={styles.buttontext}>Beaufort</p>
              {windSpeedUnit$.get() === "Beaufort" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
});

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Settings;
