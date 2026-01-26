import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import FooterComponent from '../components/Footer/Footer';

const RootLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <FooterComponent />
        </div>
    );
};

export default RootLayout;
