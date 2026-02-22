import React, { useState } from 'react';
import useInviteStore from '../../store/inviteStore';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const InviteModal = ({ isOpen, onClose }) => {
    const { createInvite, isLoading, error, successMessage, clearMessages } = useInviteStore();

    const [formData, setFormData] = useState({
        email: '',
        role: 'USER', // Managers primarily invite Users
        managerId: '' // Managers imply themselves as manager usually, or handled by backend
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await createInvite(formData);
        if (success) {
            setFormData({ email: '', role: 'USER', managerId: '' });
            setTimeout(() => {
                clearMessages();
                onClose();
            }, 2000);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Invite New Member">
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Invite a new member to your team. They will receive an email to set up their account.
                </p>

                <Input
                    label="Email Address"
                    type="email"
                    icon={EnvelopeIcon}
                    required
                    placeholder="colleague@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

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

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={isLoading}>Send Invitation</Button>
                </div>
            </form>
        </Modal>
    );
};

export default InviteModal;
