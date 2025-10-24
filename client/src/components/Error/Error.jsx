import React from "react";
import { MdError } from "react-icons/md";

function Error({ message = "Something went wrong!" }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">

            <div className="flex items-center justify-center space-x-3 mb-4">
                <img
                    src="/icons/error.webp"
                    alt="Error icon"
                    className="w-14 h-14 object-contain"
                />
               
            </div>
            <h2 className="text-lg font-semibold text-red-600">
                {message}
            </h2>
        </div>
    );
}

export default Error;
