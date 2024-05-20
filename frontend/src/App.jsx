import React, { Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import NotFound from './components/NotFound';

import { publicRoutes, privateRoutes, adminRoutes } from './routes';
import { useSelector } from 'react-redux';
import ScrollToTopOnPageChange from './helper/ScrollToTopOnPageChange';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const authRedux = useSelector((state) => state.auth);

    React.useEffect(() => {
        let state = authRedux;
        if (state?.isLoggedIn) {
            setIsLoggedIn(true);
            if (state.user?.role === 'admin') {
                setIsAdmin(true);
                return
            }
            return
        }
        setIsLoggedIn(false)
        setIsAdmin(false)
    }, [authRedux]);

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {!isLoggedIn &&
                        !isAdmin &&
                        publicRoutes.map((publicRoute, index) => {
                            const PublicLayout = publicRoute.layout;
                            const PublicPage = publicRoute.component;

                            return (
                                <Route
                                    key={index}
                                    path={publicRoute.path}
                                    element={
                                        <PublicLayout>
                                            <PublicPage />
                                        </PublicLayout>
                                    }
                                />
                            );
                        })}
                    {isLoggedIn &&
                        !isAdmin &&
                        privateRoutes.map((privateRoute, index) => {
                            const PrivateLayout = privateRoute.layout;
                            const PrivateChillLayout =
                                privateRoute.layoutChill ?? '';
                            const PrivatePage = privateRoute.component;

                            return (
                                <Route
                                    key={index}
                                    path={privateRoute.path}
                                    element={
                                        PrivateChillLayout ? (
                                            <PrivateLayout>
                                                <PrivateChillLayout>
                                                    <PrivatePage />
                                                </PrivateChillLayout>
                                            </PrivateLayout>
                                        ) : (
                                            <PrivateLayout>
                                                <PrivatePage />
                                            </PrivateLayout>
                                        )
                                    }
                                />
                            );
                        })}
                    {isLoggedIn &&
                        isAdmin &&
                        adminRoutes.map((adminRoute, index) => {
                            const AdminLayout = adminRoute.layout;
                            const AdminPage = adminRoute.component;

                            return (
                                <Route
                                    key={index}
                                    path={adminRoute.path}
                                    element={
                                        <AdminLayout>
                                            <AdminPage />
                                        </AdminLayout>
                                    }
                                />
                            );
                        })}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <ScrollToTopOnPageChange />
            </Suspense>
        </>
    );
};

export default App;
