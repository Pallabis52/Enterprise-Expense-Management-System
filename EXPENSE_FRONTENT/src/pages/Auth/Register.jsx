import React, { useState } from 'react';
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

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register({ name: formData.name, email: formData.email, password: formData.password });
            // In a real app we might redirect to login or dashboard
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px] animate-float" />
                <div className="absolute -bottom-[10%] left-[10%] w-[35%] h-[35%] bg-accent-500/10 rounded-full blur-[90px] animate-float" style={{ animationDelay: '3s' }} />
            </div>

            <div className="z-10 w-full max-w-lg px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                        Join Enterprise Expense
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Start managing your expenses like a pro
                    </p>
                </div>

                <Card3D className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            icon={UserIcon}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            icon={MailIcon}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                icon={LockIcon}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                icon={LockIcon}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                            Create Account
                        </Button>

                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </Card3D>
            </div>
        </PageTransition>
    );
};

export default Register;
