import React from 'react';
import { useNavigate } from "react-router-dom";

function Back() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // goes back to the previous page
    };

    return (
        <button
            onClick={handleBack}
            className="m-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
            ← Back
        </button>
    );
}

export default Back;
