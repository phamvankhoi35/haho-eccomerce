import { Suspense } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { routes } from './routes/routes';

function App() {

    return (
        <>
            <BrowserRouter>
                <Header />
                <main className="mt-[60px] border">
                    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                        <Routes>
                            {routes.map((r) => {
                                const elementWithLayout = r.layout ? (
                                    <r.layout>{r.element}</r.layout>
                                ) : (
                                    r.element
                                );

                                // Guest-only routes
                                if (r.guestOnly) {
                                    return (
                                        <Route element={<GuestRoute />} key={r.path}>
                                            <Route path={r.path} element={elementWithLayout} />
                                        </Route>
                                    );
                                }

                                // Protected routes (with role)
                                if (r.roles) {
                                    return (
                                        <Route element={<ProtectedRoute roles={r.roles} />} key={r.path}>
                                            <Route path={r.path} element={elementWithLayout} />
                                        </Route>
                                    );
                                }

                                // Public routes
                                return <Route key={r.path} path={r.path} element={elementWithLayout} />;
                            })}

                            <Route
                                path="*"
                                element={<div className="p-4 text-center">404 | Page not found</div>}
                            />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </BrowserRouter>
        </>
    )
}

export default App
