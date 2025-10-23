import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "../utils/ProtectedRoutes";
import {
    Landing, Home, Login, Settings, Dashboard, Register, History, Login_Required
} from "../pages/pages";
import { Suspense } from "react";
import Layout from "../layouts/Layout";
import { Loader } from "../components/components";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Suspense fallback={<Loader />}>
            <Layout />
        </Suspense>,
        children: [
            { index: true, element: <Landing /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'login_required', element: <Login_Required /> },

            { path: 'home', element: <ProtectedRoutes><Home /></ProtectedRoutes> },
            { path: 'history', element: <ProtectedRoutes><History /></ProtectedRoutes> },
            { path: 'dashboard', element: <ProtectedRoutes><Dashboard /></ProtectedRoutes> },
            { path: 'settings', element: <ProtectedRoutes><Settings /></ProtectedRoutes> },

        ]
    }
]);

export default router