import {FaShare} from "react-icons/fa";
import React from "react";

const Share = () => {
    return (
        <div>
            <button className="top-36 absolute right-16 bg-[#2d3142] text-amber-50 p-2 rounded flex"> <FaShare className="mr-1.5 mt-1"/> Shares</button>
        </div>
    )
}

export default Share