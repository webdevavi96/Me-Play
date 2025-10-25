import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext";

function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear token and user from context + localStorage
    navigate("/login"); // redirect to login page
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300"
    >
      Logout
    </button>
  );
}

export default Logout;
