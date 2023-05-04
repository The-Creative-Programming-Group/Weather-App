import React, { useEffect, useRef, useState } from "react";
import Layout from "~/components/Layout";
import Image from "next/image";
import styles from "./settings.module.css";

const Settings = () => {
  type SaveButtonTextType = "Save changes" | "Saved";

  const doneImage = "/assets/done.png";
  const [temperatureUnit, setTemperatureUnit] = useState<string>("Celsius");
  const [windSpeedUnit, setWindSpeedUnit] = useState<string>("Miles per hour");
  const [saveButtonText, setSaveButtonText] =
    React.useState<SaveButtonTextType>("Save changes");
  const saveButtonTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (saveButtonTextRef.current == undefined) return;
    if (saveButtonText === "Save changes") return;
    saveButtonTextRef.current.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: 500,
      }
    );
  }, [saveButtonText]);

  const handleTemperatureUnitClick = (unit: string) => {
    setTemperatureUnit(unit);
    setSaveButtonText("Save changes");
  };
  const handleSpeedUnitClick = (unit: string) => {
    setWindSpeedUnit(unit);
    setSaveButtonText("Save changes");
  };

  const normalButtonClass = styles.normalbutton ? styles.normalbutton : "";

  return (
    <>
      <Layout title={"Settings"}>
        <div className="flex flex-col items-center w-full">
          <h1 className="flex mt-10 justify-center text-3xl font-bold">
            Settings
          </h1>
          <hr className="w-4/12 h-1.5 bg-[#2d3142] mt-3 rounded" />
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
            <button
              className={`bg-[#2d3142] w-60 h-9 border-solid font-bold rounded text-white`}
              onClick={() => {
                setSaveButtonText("Saved");
              }}
            >
              <div ref={saveButtonTextRef}>{saveButtonText}</div>
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Settings;
