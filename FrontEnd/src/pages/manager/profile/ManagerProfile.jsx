import React, { useState } from 'react';
import useAuthStore from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Toggle from '../../../components/ui/Toggle';
import { UserCircleIcon, BellIcon, MoonIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const ManagerProfile = () => {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false); // In real app, connect to theme store

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {user?.name?.[0] || 'M'}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'Manager Name'}</h2>
                    <p className="text-gray-500">{user?.email || 'manager@company.com'}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                        {user?.role || 'MANAGER'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <LockClosedIcon className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security</h3>
                    </div>
                    <Input label="Current Password" type="password" placeholder="••••••••" />
                    <Input label="New Password" type="password" placeholder="••••••••" />
                    <Button className="w-full">Update Password</Button>
                </div>

                {/* Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <BellIcon className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preferences</h3>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BellIcon className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                <p className="text-xs text-gray-500">Receive analysis updates</p>
                            </div>
                        </div>
                        <Toggle checked={notifications} onChange={setNotifications} />
                    </div>

                    <div className="w-full border-t border-gray-100 dark:border-gray-700"></div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MoonIcon className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                <p className="text-xs text-gray-500">Switch app theme</p>
                            </div>
                        </div>
                        <Toggle checked={darkMode} onChange={setDarkMode} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerProfile;
