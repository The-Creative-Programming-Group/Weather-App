import React, { useState } from "react";
import Layout from "~/components/Layout";
import Image from "next/image";
import styles from "./settings.module.css";

const Settings = () => {
  const doneImage = "/assets/done.png";
  const [temperatureUnit, setTemperatureUnit] = useState<string>("Celsius");
  const [windSpeedUnit, setWindSpeedUnit] = useState<string>("Miles per hour");

  const handleTemperatureUnitClick = (unit: string) => {
    setTemperatureUnit(unit);
  };
  const handleSpeedUnitClick = (unit: string) => {
    setWindSpeedUnit(unit);
  };

  const normalButtonClass = styles.normalbutton ? styles.normalbutton : '';

  return (
    <>
      <Layout title={"Settings"}>
        <div className="flex flex-col items-center w-full">
          <h1 className="flex mt-10 justify-center text-3xl font-bold">
            Settings
          </h1>
          <hr className="w-3/12 h-1.5 bg-[#856868] mt-3 rounded" />
          <div className="flex flex-col justify-center m-5">
            <h2 className="text-basic font-bold">Temperature units</h2>
            <button
              className={`${normalButtonClass} ${
                temperatureUnit === "Celsius" ? "border-2" : ""
              }`}
              onClick={() => handleTemperatureUnitClick("Celsius")}
            >
              <p className={styles.buttontext}>Celsius (°C)</p>
              {temperatureUnit === "Celsius" && (
                <Image src={doneImage} alt="Checkmark" width={29} height={29} />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                temperatureUnit === "Fahrenheit" ? "border-2" : ""
              }`}
              onClick={() => handleTemperatureUnitClick("Fahrenheit")}
            >
              <p className={styles.buttontext}>Fahrenheit (°F)</p>
              {temperatureUnit === "Fahrenheit" && (
                <Image src={doneImage} alt="Checkmark" width={29} height={29} />
              )}
            </button>
          </div>

          <div className="flex flex-col justify-center m-5">
            <h2 className="text-basic font-bold">Wind speed units</h2>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit === "Miles per hour" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Miles per hour")}
            >
              <p className={styles.buttontext}>Miles per hour (mph)</p>
              {windSpeedUnit === "Miles per hour" && (
                <Image src={doneImage} alt="Checkmark" width={29} height={29} />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit === "Kilometers per hour" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Kilometers per hour")}
            >
              <p className={styles.buttontext}>Kilometers per hour (km/h)</p>
              {windSpeedUnit === "Kilometers per hour" && (
                <Image src={doneImage} alt="Checkmark" width={29} height={29} />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit === "Knots" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Knots")}
            >
              <p className={styles.buttontext}>Knots</p>
              {windSpeedUnit === "Knots" && (
                <Image src={doneImage} alt="Checkmark" width={29} height={29} />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit === "Meters per second" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Meters per second")}
            >
              <p className={styles.buttontext}>Meters per second (m/s)</p>
              {windSpeedUnit === "Meters per second" && (
                <Image src={doneImage} alt="Checkmark" width={29} height={29} />
              )}
            </button>
            <button
              className={`${normalButtonClass} ${
                windSpeedUnit === "Beaufort" ? "border-2" : ""
              }`}
              onClick={() => handleSpeedUnitClick("Beaufort")}
            >
              <p className={styles.buttontext}>Beaufort</p>
              {windSpeedUnit === "Beaufort" && (
                <Image src={doneImage} alt="Checkmark" width={29} height={29} />
              )}
            </button>
          </div>

          <div>
            <button className="bg-[#ddc3c3] w-60 h-9 border-solid font-bold rounded">
              Save Changes
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Settings;
