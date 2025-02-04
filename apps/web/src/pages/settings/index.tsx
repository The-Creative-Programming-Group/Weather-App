import React from "react";
import Image from "next/image";
import { observer } from "@legendapp/state/react";
import { RxCheck } from "react-icons/rx";

import type { TemperatureUnitType, WindSpeedUnitType } from "~/states";
import chineseFlag from "~/assets/chinese-flag.png";
import germanFlag from "~/assets/german-flag.png";
import indonesianFlag from "~/assets/indonesian-flag.png";
import usaFlag from "~/assets/usa-flag.png";
import Layout from "~/components/Layout";
import {
  getLocaleProps,
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from "~/locales";
import { temperatureUnit$, windSpeedUnit$ } from "~/states";
import styles from "./settings.module.css";

const Settings = observer(() => {
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  const translationSettings = useScopedI18n("settings");
  const translationCommon = useScopedI18n("common");

  const handleTemperatureUnitClick = (unit: TemperatureUnitType) => {
    temperatureUnit$.set(unit);
  };
  const handleSpeedUnitClick = (unit: WindSpeedUnitType) => {
    windSpeedUnit$.set(unit);
  };

  const normalButtonClass = styles.normalbutton ? styles.normalbutton : "";

  return (
    <>
      <Layout title={translationCommon("menu settings")} page="settings">
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
              <Image
                src={usaFlag}
                alt="Flag of the United States"
                width={20}
                height={20}
              />
              <p className={`${styles.buttontext} ml-2`}>
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
              <Image
                src={germanFlag}
                alt="Flag of Germany"
                width={20}
                height={20}
              />
              <p className={`${styles.buttontext} ml-2`}>
                {translationSettings("german")}
              </p>
              {locale === "de" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                locale === "id" ? "border-2" : ""
              }`}
              onClick={() => changeLocale("id")}
            >
              <Image
                src={indonesianFlag}
                alt="Flag of the Republic of Indonesia"
                width={20}
                height={20}
              />
              <p className={`${styles.buttontext} ml-2`}>
                {translationSettings("indonesian")}
              </p>
              {locale === "id" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                locale === "zh-CN" ? "border-2" : ""
              }`}
              onClick={() => changeLocale("zh-CN")}
            >
              <Image
                src={chineseFlag}
                alt="Flag of PRC"
                width={20}
                height={20}
              />
              <p className={`${styles.buttontext} ml-2`}>
                {translationSettings("chinese")}
              </p>
              {locale === "zh-CN" && (
                <RxCheck width={20} height={20} className="h-9 w-9" />
              )}
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
});

export const getStaticProps = getLocaleProps();

export default Settings;
