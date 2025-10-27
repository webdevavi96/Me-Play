import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Layout() {
    return (
    <>
        <Navbar />
        <main className="pt-15 min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-950">
            <Outlet />
        </main>
        <Footer />
    </>
    );
}

export default Layout;
