import React, { useContext } from "react";
import { AuthContext } from "../../utils/authContext";
import Logout from "../../components/Buttons/Logout";
import capitalizeName from "../../utils/capitaliseName";
import { useNavigate } from "react-router-dom";

function Settings() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6  bg-gray-900 text-white rounded-xl shadow-lg">
      {/* ---------- HEADER ---------- */}
      <h1 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
        Account Settings
      </h1>

      {/* ---------- USER INFO ---------- */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <img
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-800 shadow-md"
          src={user?.avatar || "/images/default-avatar.jpg"}
          alt="User Avatar"
        />

        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {capitalizeName(user?.fullName)}
          </h2>
          <p className="text-gray-400">@{user?.username}</p>
          <p className="text-gray-400 mt-1">{user?.email}</p>

          <div className="mt-4">
            <span className="text-sm bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
              Member since{" "}
              {new Date(user?.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- SETTINGS OPTIONS ---------- */}
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Account Privacy</h3>
            <p className="text-gray-400 text-sm">
              Manage your channel visibility and data privacy.
            </p>
          </div>
          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
            Manage
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-gray-400 text-sm">
              Control when and how you receive updates.
            </p>
          </div>
          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
            Configure
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Appearance</h3>
            <p className="text-gray-400 text-sm">
              Switch between dark and light themes.
            </p>
          </div>
          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
            Customize
          </button>
        </div>
      </div>

      {/* ---------- LOGOUT ---------- */}
      <div className="mt-10 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium mb-3">Logout</h3>
        <Logout />
      </div>
    </div>
  );
}

export default Settings;
