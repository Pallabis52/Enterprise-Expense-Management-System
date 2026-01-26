import React, { useState } from 'react';
import useAuthStore from '../../../store/adminExpenseStore'; // Using general store or auth store
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Toggle from '../../../components/ui/Toggle';
import { UserCircleIcon, ShieldCheckIcon, BellIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const AdminProfile = () => {
    // Mock User Data
    const user = {
        name: "Admin User",
        email: "admin@expenses.com",
        role: "Administrator",
        lastLogin: "2023-10-27 10:30 AM"
    };

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        reports: true
    });

    const [privacy, setPrivacy] = useState({
        twoFactor: true,
        sessionTimeout: false
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <UserCircleIcon className="w-12 h-12" />
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {user.role}
                        </span>
                        <span className="text-gray-400">Last login: {user.lastLogin}</span>
                    </div>
                </div>
                <Button variant="outline">Edit Profile</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheckIcon className="w-6 h-6 text-primary-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Auth</p>
                                <p className="text-xs text-gray-500">Secure your account with 2FA.</p>
                            </div>
                            <Toggle checked={privacy.twoFactor} onChange={(v) => setPrivacy({ ...privacy, twoFactor: v })} />
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Change Password</h4>
                            <div className="space-y-3">
                                <Input type="password" placeholder="Current Password" />
                                <Input type="password" placeholder="New Password" />
                                <Button size="sm" className="w-full">Update Password</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BellIcon className="w-6 h-6 text-primary-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                            <Toggle checked={notifications.email} onChange={(v) => setNotifications({ ...notifications, email: v })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                            <Toggle checked={notifications.push} onChange={(v) => setNotifications({ ...notifications, push: v })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Weekly Reports</span>
                            <Toggle checked={notifications.reports} onChange={(v) => setNotifications({ ...notifications, reports: v })} />
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-4">
                            <ComputerDesktopIcon className="w-6 h-6 text-primary-500" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appearance</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                <p className="text-xs text-gray-500">Toggle system theme.</p>
                            </div>
                            {/* Theme toggle uses global hook usually, this is just visual placeholder if needed within page */}
                            <Toggle checked={document.documentElement.classList.contains('dark')} onChange={() => document.documentElement.classList.toggle('dark')} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminProfile;
