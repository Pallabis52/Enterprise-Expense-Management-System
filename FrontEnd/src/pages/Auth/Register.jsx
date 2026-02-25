import React, { useState } from 'react';
import { premiumSuccess, premiumError, premiumWarning } from '../../utils/premiumAlerts';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card3D from '../../components/ui/Card3D';
import PageTransition from '../../components/layout/PageTransition';

// Simple SVGs for Register
const UserIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
)
const MailIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
)
const LockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
)


const Register = () => {
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'USER' });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            premiumWarning('Password Mismatch', 'Passwords do not match');
            return;
        }

        try {
            await register({ name: formData.name, email: formData.email, password: formData.password, role: formData.role });

            premiumSuccess('Registration Successful!', 'Your account has been created.', null).then(() => {
                navigate('/login');
            });

        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong during registration. Please try again.';
            premiumError('Registration Failed', msg);
        }
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-500/20 dark:bg-accent-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] left-[10%] w-[35%] h-[35%] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[90px] animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-[20%] right-[5%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[110px] animate-pulse" style={{ animationDelay: '3s' }} />

                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="z-10 w-full max-w-xl px-6 py-12">
                <div className="text-center mb-10 transform transition-all duration-700 animate-in fade-in slide-in-from-top-8">
                    <div className="inline-block p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <span className="text-white text-2xl font-black italic">E</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                        Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">Aether</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Begin your journey into seamless expense management
                    </p>
                </div>

                <div className="relative group">
                    {/* Animated Border Glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-[2rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>

                    <Card3D className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden rounded-[2rem] shadow-2xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    placeholder="John Doe"
                                    icon={UserIcon}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white/50 dark:bg-gray-900/50 border-white/30 dark:border-gray-700/30 transition-all duration-300"
                                    required
                                />

                                <Input
                                    label="Work Email"
                                    type="email"
                                    placeholder="name@company.com"
                                    icon={MailIcon}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-white/50 dark:bg-gray-900/50 border-white/30 dark:border-gray-700/30 transition-all duration-300"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
                                    Strategic Role
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['USER', 'MANAGER', 'ADMIN'].map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role })}
                                            className={`py-3 px-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${formData.role === role
                                                ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-500/20 scale-105'
                                                : 'bg-white/50 dark:bg-gray-900/50 text-gray-500 border-white/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={LockIcon}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-white/50 dark:bg-gray-900/50 border-white/30 dark:border-gray-700/30 transition-all duration-300"
                                    required
                                />
                                <Input
                                    label="Confirm"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={LockIcon}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="bg-white/50 dark:bg-gray-900/50 border-white/30 dark:border-gray-700/30 transition-all duration-300"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-2 animate-in rotate-in-1">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white shadow-xl shadow-primary-500/25 border-none transform active:scale-95 transition-all py-4 mt-2"
                                isLoading={isLoading}
                                size="lg"
                            >
                                Deploy Security Profile
                            </Button>

                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Existing operative?{' '}
                                <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 dark:text-primary-400 underline decoration-2 decoration-primary-500/30 underline-offset-4">
                                    Internal Login
                                </Link>
                            </p>
                        </form>
                    </Card3D>
                </div>
            </div>
        </PageTransition>
    );
};

export default Register;
