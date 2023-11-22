import React from "react";
import Layout from "~/components/Layout";
import styles from "./settings.module.css";
import {
  temperatureUnit$,
  type TemperatureUnitType,
  windSpeedUnit$,
  type WindSpeedUnitType,
} from "~/states";
import { observer } from "@legendapp/state/react";
import { RxCheck } from "react-icons/rx";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const Settings = observer(() => {
  const { locale } = useRouter();

  const router = useRouter();

  const changeLocale = (locale: string) => {
    void router.push(router.pathname, router.asPath, { locale });
  };

  const { t: translationSettings } = useTranslation("settings");
  const { t: translationCommon } = useTranslation("common");

  const handleTemperatureUnitClick = (unit: TemperatureUnitType) => {
    temperatureUnit$.set(unit);
  };
  const handleSpeedUnitClick = (unit: WindSpeedUnitType) => {
    windSpeedUnit$.set(unit);
  };

  const normalButtonClass = styles.normalbutton ? styles.normalbutton : "";

  return (
    <>
      <Layout title={translationCommon("menu settings")}>
        <div className="flex w-full flex-col items-center">
          <h1 className="mt-10 flex justify-center text-4xl font-bold">
            {translationCommon("menu settings")}
          </h1>
          <hr className="mt-3 h-1.5 w-6/12 rounded bg-[#2d3142] md:w-4/12" />
          <div className="m-5 flex flex-col justify-center">
            <h2 className="text-basic font-bold">
              {translationSettings("temperature units")}
            </h2>
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
            <h2 className="text-basic font-bold">
              {translationSettings("wind speed units")}
            </h2>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "miles per hour" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("miles per hour")}
            >
              <p className={styles.buttontext}>
                {translationCommon("miles per hour")} (mph)
              </p>
              {windSpeedUnit$.get() === "miles per hour" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "kilometers per hour" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("kilometers per hour")}
            >
              <p className={styles.buttontext}>
                {translationCommon("kilometers per hour")} (km/h)
              </p>
              {windSpeedUnit$.get() === "kilometers per hour" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "knots" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("knots")}
            >
              <p className={styles.buttontext}>{translationCommon("knots")}</p>
              {windSpeedUnit$.get() === "knots" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "meters per second" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("meters per second")}
            >
              <p className={styles.buttontext}>
                {translationCommon("meters per second")} (m/s)
              </p>
              {windSpeedUnit$.get() === "meters per second" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit$.get() === "beaufort" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("beaufort")}
            >
              <p className={styles.buttontext}>
                {translationCommon("beaufort")}
              </p>
              {windSpeedUnit$.get() === "beaufort" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
          </div>

          <div className="m-5 flex flex-col justify-center">
            <h2 className="text-basic font-bold">
              {translationSettings("language")}
            </h2>
            <button
              className={`${normalButtonClass} ${
                locale === "en" ? "border-2" : ""
              }`}
              onClick={() => changeLocale("en")}
            >
              <p className={styles.buttontext}>
                {translationSettings("english")}
              </p>
              {locale === "en" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                locale === "de" ? "border-2" : ""
              }`}
              onClick={() => changeLocale("de")}
            >
              <p className={styles.buttontext}>
                {translationSettings("german")}
              </p>
              {locale === "de" && (
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
      ...(await serverSideTranslations(locale, ["settings", "common"])),
    },
  };
}

export default Settings;
