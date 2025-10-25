import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './authContext';
import { useContext } from 'react';


function ProtectedRoutes({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated)
        return <Navigate to="/login_required" replace state={{ from: window.location.pathname }} />;
    return children;
}

export default ProtectedRoutes;