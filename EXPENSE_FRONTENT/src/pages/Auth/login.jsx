import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card3D from '../../components/ui/Card3D';
import PageTransition from '../../components/layout/PageTransition';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'; // Assumes installed, else I'd use SVGs
// Fallback icons if heroicons missing
const MailIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
)
const LockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
)


const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[100px] animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-accent-500/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-blue-500/20 rounded-full blur-[90px] animate-float" style={{ animationDelay: '4s' }} />
            </div>

            <div className="z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                        Enterprise Expense
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Welcome back, please login to your account
                    </p>
                </div>

                <Card3D className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            icon={MailIcon}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                icon={LockIcon}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                            Sign In
                        </Button>

                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </Card3D>
            </div>
        </PageTransition>
    );
};

export default Login;
