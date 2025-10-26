import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './authContext';
import { useContext } from 'react';
import { Loader } from 'lucide-react';


function ProtectedRoutes({ children }) {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) return <Loader color='whitte' size={100}/>
    if (!isAuthenticated)
        return <Navigate to="/login_required" replace state={{ from: window.location.pathname }} />;
    return children;
}

export default ProtectedRoutes;