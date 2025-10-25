import React, { useContext } from "react";
import { AuthContext } from "../../utils/authContext";
import Logout from "../../components/Buttons/Logout";
import capitalizeName from "../../utils/capitaliseName";

function Settings() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div>
      {isAuthenticated ? (
        <>
        <div className="user w-auto flex gap-2 items-center">
          <img className="w-20 h-20 rounded-full" src={user?.avatar} alt="" />
          <span>Welcome, {capitalizeName(user?.fullName)}</span>
        </div>

          <div className="btn py-2">
            <Logout />
          </div>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}

export default Settings;
