import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useState, useEffect } from "react";
import { AuthContext } from "../utils/authContext";

function Layout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) setIsAuthenticated(true);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <Navbar />

            {/* Main content area with top padding for fixed navbar */}
            <main className="pt-20 px-4 md:px-6 min-h-screen bg-gray-50">
                <Outlet />
            </main>

            <Footer />
        </AuthContext.Provider>
    );
}

export default Layout;
