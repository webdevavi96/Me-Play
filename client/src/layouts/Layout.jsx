import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useState, useEffect } from "react";

function Layout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) setIsAuthenticated(true);
    }, []);

    return (<>
        <Navbar />
        <main className="pt-15 min-h-screen bg-gray-50">
            <Outlet />
        </main>
        <Footer />
    </>
    );
}

export default Layout;
