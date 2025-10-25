import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "../utils/ProtectedRoutes";
import { Suspense, lazy } from "react";
import Layout from "../layouts/Layout";
import { Loader } from "../components/components";

// Lazy load all pages
const Landing = lazy(() => import("../pages/Landing/Landing"));
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/AuthPages/Login/Login"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dasboard"));
const Register = lazy(() => import("../pages/AuthPages/Register/Register"));
const History = lazy(() => import("../pages/History/History"));
const Login_Required = lazy(() => import("../pages/Login_Required/Login_Required"));
const VideoPlayer = lazy(() => import("../pages/Player/VideoPlayer"))

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Loader />}>
                <Layout />
            </Suspense>
        ),
        children: [
            { index: true, element: <Suspense fallback={<Loader />}><Landing /></Suspense> },
            { path: 'login', element: <Suspense fallback={<Loader />}><Login /></Suspense> },
            { path: 'register', element: <Suspense fallback={<Loader />}><Register /></Suspense> },
            { path: 'login_required', element: <Suspense fallback={<Loader />}><Login_Required /></Suspense> },

            { path: 'home', element: <ProtectedRoutes><Suspense fallback={<Loader />}><Home /></Suspense></ProtectedRoutes> },
            { path: 'history', element: <ProtectedRoutes><Suspense fallback={<Loader />}><History /></Suspense></ProtectedRoutes> },
            { path: 'dashboard', element: <ProtectedRoutes><Suspense fallback={<Loader />}><Dashboard /></Suspense></ProtectedRoutes> },
            { path: 'settings', element: <ProtectedRoutes><Suspense fallback={<Loader />}><Settings /></Suspense></ProtectedRoutes> },
            { path: "/watch/:id", element: <ProtectedRoutes><Suspense fallback={<Loader />}><VideoPlayer /></Suspense></ProtectedRoutes> }
        ]
    }
]);

export default router;
