import React, {useState} from "react"
import Layout from "~/components/Layout";
import Image from "next/image";

const settings = () => {
    const doneImage = "/assets/done.png";
    const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
    const [windSpeedUnit, setWindSpeedUnit] = useState('Miles per hour');

    const handleTemperatureUnitClick = (unit:any) => {
        setTemperatureUnit(unit);
    };
    const handleSpeedUnitClick = (unit:any) => {
        setWindSpeedUnit(unit);
    };
    return (
        <>
            <Layout title={"Settings"}>
                <div className="flex flex-col items-center w-full">
                    <h1 className="flex mt-10 justify-center text-3xl font-bold">Settings</h1>
                    <hr className="w-3/12 h-1.5 bg-[#856868] mt-3 rounded" />
                    <div className="flex flex-col justify-center m-5">
                        <h2 className="text-basic font-bold">Temperature Units</h2>
                        <button
                            className="bg-[#ddc3c3] flex flex-row justify-between items-center mt-3 w-96 h-10 text-left border-solid border-black"
                            onClick={() => handleTemperatureUnitClick('Celsius')}
                        >
                            <p className="ml-3 font-bold">Celsius (°C)</p>
                            {temperatureUnit === 'Celsius' && <Image src={doneImage} alt="Checkmark" width={29} height={29} />}
                        </button>
                        <button
                            className="bg-[#ddc3c3] flex flex-row justify-between items-center mt-3 w-96 h-10 text-left border-solid border-black"
                            onClick={() => handleTemperatureUnitClick('Fahrenheit')}
                        >
                            <p className="ml-3 font-bold">Fahrenheit (°F)</p>
                            {temperatureUnit === 'Fahrenheit' && <Image src={doneImage} alt="Checkmark" width={29} height={29} />}
                        </button>
                    </div>

                    <div className="flex flex-col justify-center m-5">
                        <h2 className="text-basic font-bold">Wind speed Units</h2>
                        <button
                            className="bg-[#ddc3c3] flex flex-row justify-between items-center mt-3 w-96 h-10 text-left border-solid border-black"
                            onClick={() => handleSpeedUnitClick('Miles per hour')}
                        >
                            <p className="ml-3 font-bold">Miles per hour (mph)</p>
                            {temperatureUnit === 'Miles per hour' && <Image src={doneImage} alt="Checkmark" width={29} height={29} />}
                        </button>
                        <button
                            className="bg-[#ddc3c3] flex flex-row justify-between items-center mt-3 w-96 h-10 text-left border-solid border-black"
                            onClick={() => handleSpeedUnitClick('Kilometers per hour')}
                        >
                            <p className="ml-3 font-bold">Kilometers per hour(km/h)</p>
                            {temperatureUnit === 'Kilometers per hour' && <Image src={doneImage} alt="Checkmark" width={29} height={29} />}
                        </button>
                        <button
                            className="bg-[#ddc3c3] flex flex-row justify-between items-center mt-3 w-96 h-10 text-left border-solid border-black"
                            onClick={() => handleSpeedUnitClick('Knots')}
                        >
                            <p className="ml-3 font-bold">Knots</p>
                            {temperatureUnit === 'Knots' && <Image src={doneImage} alt="Checkmark" width={29} height={29} />}
                        </button>
                        <button
                            className="bg-[#ddc3c3] flex flex-row justify-between items-center mt-3 w-96 h-10 text-left border-solid border-black"
                            onClick={() => handleSpeedUnitClick('Meters per second')}
                        >
                            <p  className="ml-3 font-bold">Meters per second(m/s)</p>
                            {temperatureUnit === 'Meters per second' && <Image src={doneImage} alt="Checkmark" width={29} height={29} />}
                        </button>
                        <button
                            className="bg-[#ddc3c3] flex flex-row justify-between items-center mt-3 w-96 h-10 text-left border-solid border-black"
                            onClick={() => handleSpeedUnitClick('Beaufort')}
                        >
                            <p className="ml-3 font-bold">Beaufort</p>
                            {temperatureUnit === 'Beaufort' && <Image src={doneImage} alt="Checkmark" width={29} height={29} />}
                        </button>
                    </div>

                    <div>
                        <button className="bg-[#ddc3c3] w-60 h-9 border-solid font-bold rounded">Save Changes</button>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default settings;
