import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

const NotFound = () => {
    return (
        <PageTransition className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 text-center px-4">
                {/* Glitchy/Modern 404 Text */}
                <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-800 select-none drop-shadow-2xl">
                    404
                </h1>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-[-20px] mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-10 text-lg">
                    Oops! The page you're looking for seems to have wandered off into the digital void.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="px-8 py-3.5 text-base font-semibold text-white transition-all bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105 active:scale-95"
                    >
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </PageTransition>
    );
};

export default NotFound;
