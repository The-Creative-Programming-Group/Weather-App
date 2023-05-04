import React from "react"
import Layout from "~/components/Layout";

const index = () => {
    return (
        <>
            <Layout title={"Location Settings"}>
                <div className="flex flex-col items-center w-full">
                    <h1 className="flex mt-24 justify-center text-3xl font-bold">
                        Location settings
                    </h1>
                    <hr className="w-4/12 h-1.5 bg-[#2d3142] mt-3 rounded" />
                    <div
                        id="styles-setup"
                        className="mt-9 w-full flex flex-col items-center"
                    >
                        <label className="mr-131 mb-2">Change location</label>
                        <div className="flex justify-center w-full">
                        <img
                            className="transform bg-[#d8d5db] pt-3 pb-3 pl-3 w-12"
                            src="assets/search2.png"
                            alt="search-icon"
                            width={56}
                            height={56}
                        />
                        <input
                            className="w-4/12 bg-[#d8d5db] pt-0.5 pb-0.5 outline-0 text-xl pl-3 text-black font-bold"
                            placeholder="Search for your location"
                            type="text"
                        />
                        </div>
                        <div
                            id="styles-setup"
                            className="mt-9 w-full flex flex-col items-center"
                        >
                            <label className="mr-131 mb-2">Add new location</label>
                            <div className="flex justify-center w-full">
                                <img
                                    className="transform bg-[#d8d5db] pt-3 pb-3 pl-3 w-12"
                                    src="assets/search2.png"
                                    alt="search-icon"
                                    width={56}
                                    height={56}
                                />
                                <input
                                    className="w-4/12 bg-[#d8d5db] pt-0.5 pb-0.5 outline-0 text-xl pl-3 text-black font-bold"
                                    placeholder="Search for your location"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default index;
