// src/routes/routeConfig.ts
import { lazy, type ComponentType, type ReactNode } from "react";

// Layouts
const UserLayout = lazy(() => import("../components/layout/UserLayout"));
const AdminLayout = lazy(() => import("../components/layout/AdminLayout"));

const Home = lazy(() => import("../pages/Home"));
const Forbidden = lazy(() => import("../pages/Forbidden"));

const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));

const Cart = lazy(() => import("../pages/Cart"));
const Profile = lazy(() => import("../pages/Profile"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Order = lazy(() => import("../pages/Order"));

const Admin = lazy(() => import("../pages/admin/Admin"));

const PageNotFound = lazy(() => import("../pages/PageNotFound"));


interface RouteConfig {
    path: string;
    element: React.ReactNode;
    roles?: "user" | "admin" | "seller"[];
    guestOnly?: boolean; // thêm flag cho login/signup
    layout?: ComponentType<{ children: ReactNode }>;
}

// Public routes
const publicRoutes: RouteConfig[] = [
    { path: "/", element: <Home /> },
    { path: "/cart", element: <Cart /> },
    { path: "/403", element: <Forbidden /> },

    { path: "*", element: <PageNotFound /> },
];

// Guest routes
const guestRoutes: RouteConfig[] = [
    { path: "/auth/login", element: <Login />, guestOnly: true },
    { path: "/auth/signup", element: <Signup />, guestOnly: true },
];

// ---- nhóm user routes ----
const userRoutes: RouteConfig[] = [
    { path: "/profile", element: <Profile /> },
    { path: "/checkout", element: <Checkout /> },
    { path: "/order", element: <Order /> },
].map((r) => ({ ...r, layout: UserLayout, roles: ["user"] as const }));

// ---- nhóm admin routes ----
const adminRoutes: RouteConfig[] = [
    { path: "/admin", element: <Admin /> },
].map((r) => ({ ...r, layout: AdminLayout, roles: ["admin"] as const }));

export const routes: RouteConfig[] = [
    ...publicRoutes,
    ...guestRoutes,
    ...userRoutes,
    ...adminRoutes,
];