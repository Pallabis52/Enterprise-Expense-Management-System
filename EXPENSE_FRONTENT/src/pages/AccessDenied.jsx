import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

const AccessDenied = () => {
    return (
        <PageTransition className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[10%] w-[30%] h-[30%] bg-orange-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 text-center px-4">
                <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 select-none drop-shadow-sm opacity-20">
                    403
                </h1>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-[-40px] mb-4">
                    Access Denied
                </h2>

                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-10 text-lg">
                    You don't have permission to access this area. If you believe this is a mistake, please contact your administrator.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="px-8 py-3.5 text-base font-semibold text-white transition-all bg-gradient-to-r from-red-600 to-orange-600 rounded-xl hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 active:scale-95"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </PageTransition>
    );
};

export default AccessDenied;
