import React from 'react';
import axios from 'axios';

function Settings() {
  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_AUTH_URL}/logout`);
      // Optional: redirect to login page after logout
      window.location.href = '/login';
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <button
        onClick={logout} // ✅ pass function reference
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Settings;
