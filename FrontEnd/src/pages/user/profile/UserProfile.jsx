import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../store/authStore';
import userService from '../../../services/userService';
import Card3D from '../../../components/ui/Card3D';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Swal from 'sweetalert2';
import PageTransition from '../../../components/layout/PageTransition';

const UserProfile = () => {
    const user = useAuthStore((state) => state.user);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetch fresh profile data
        const loadProfile = async () => {
            try {
                const data = await userService.getProfile();
                setFormData(prev => ({ ...prev, name: data.name, email: data.email }));
            } catch (err) {
                console.error(err);
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.updateProfile({ name: formData.name });
            Swal.fire('Success', 'Profile updated successfully', 'success');
            setIsEditing(false);
        } catch (err) {
            Swal.fire('Error', 'Failed to update profile', 'error');
        }
    };

    return (
        <PageTransition>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your account settings
                    </p>
                </div>

                <Card3D className="p-8 bg-white dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                                {formData.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{formData.name}</h3>
                                <p className="text-sm text-gray-500">{formData.email}</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                    {user?.role || 'USER'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            <Input
                                label="Email Address"
                                value={formData.email}
                                disabled={true} // Email usually immutable
                            />
                        </div>

                        {/* Password Section - Optional hidden if not editing or separate modal */}
                        {isEditing && (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Change Password</h4>
                                <Input
                                    type="password"
                                    label="Current Password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />
                                <Input
                                    type="password"
                                    label="New Password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            {isEditing ? (
                                <>
                                    <Button variant="secondary" onClick={() => setIsEditing(false)} type="button">
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)} type="button">
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </form>
                </Card3D>
            </div>
        </PageTransition>
    );
};

export default UserProfile;
