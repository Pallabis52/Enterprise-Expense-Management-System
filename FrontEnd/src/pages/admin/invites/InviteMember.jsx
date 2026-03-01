import React, { useState } from 'react';
import useInviteStore from '../../../store/inviteStore';
import useAuthStore from '../../../store/authStore';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import { EnvelopeIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const InviteMember = () => {
    const { user } = useAuthStore();
    const { createInvite, isLoading, error, successMessage, clearMessages } = useInviteStore();

    const [formData, setFormData] = useState({
        email: '',
        role: user?.role === 'MANAGER' ? 'USER' : 'USER', // Default
        managerId: '' // For Admin to assign manager
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await createInvite(formData);
        if (success) {
            setFormData({ ...formData, email: '' });
            setTimeout(clearMessages, 3000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Invite New Member</h1>

            <Card className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                        <UserPlusIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Invitation</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Invite a new member to join the team. They will receive an email with a link to set up their account.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        icon={EnvelopeIcon}
                        required
                        placeholder="colleague@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    {user?.role === 'ADMIN' && (
                        <CustomDropdown
                            label="Role"
                            options={[
                                { label: 'User (Employee)', value: 'USER', description: 'Standard operative access' },
                                { label: 'Manager', value: 'MANAGER', description: 'Executive oversight & approval' },
                                { label: 'Admin', value: 'ADMIN', description: 'Full system architecture control' }
                            ]}
                            value={formData.role}
                            onChange={(val) => setFormData({ ...formData, role: val })}
                        />
                    )}

                    {/* Admin assigning user to manager - simplified for now, ideally a user select dropdown */}
                    {user?.role === 'ADMIN' && formData.role === 'USER' && (
                        <Input
                            label="Assign to Manager ID (Optional)"
                            type="number"
                            placeholder="Manager ID"
                            value={formData.managerId}
                            onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                        />
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-200">
                            {successMessage}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" isLoading={isLoading}>
                            Send Invitation
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default InviteMember;
