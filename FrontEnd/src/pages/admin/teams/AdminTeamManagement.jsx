import React, { useEffect, useState } from 'react';
import useAdminTeamStore from '../../../store/adminTeamStore';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import { UsersIcon, UserPlusIcon, PlusIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const AdminTeamManagement = () => {
    const {
        teams,
        managers,
        availableUsers,
        fetchTeams,
        fetchManagers,
        fetchAvailableUsers,
        createTeam,
        addMember,
        removeMember,
        assignManager,
        isLoading
    } = useAdminTeamStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [selectedManagerId, setSelectedManagerId] = useState('');

    useEffect(() => {
        fetchTeams();
        fetchManagers();
        fetchAvailableUsers();
    }, []);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName || !selectedManagerId) return;

        const success = await createTeam(newTeamName, selectedManagerId);
        if (success) {
            setIsCreateModalOpen(false);
            setNewTeamName('');
            setSelectedManagerId('');
            Swal.fire('Success', 'Team created successfully', 'success');
        }
    };

    const handleAddMember = async (teamId) => {
        const { value: userId } = await Swal.fire({
            title: 'Add Member',
            input: 'select',
            inputOptions: Object.fromEntries(availableUsers.map(u => [u.id, u.name + ' (' + u.email + ')'])),
            inputPlaceholder: 'Select a user',
            showCancelButton: true,
        });

        if (userId) {
            const success = await addMember(teamId, userId);
            if (success) Swal.fire('Added', 'Member added to team', 'success');
        }
    };

    const handleRemoveMember = async (teamId, userId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Remove member from team?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, remove'
        });

        if (result.isConfirmed) {
            const success = await removeMember(teamId, userId);
            if (success) Swal.fire('Removed', 'Member removed from team', 'success');
        }
    };

    const handleAssignManager = async (teamId) => {
        const { value: managerId } = await Swal.fire({
            title: 'Change Manager',
            input: 'select',
            inputOptions: Object.fromEntries(managers.map(m => [m.id, m.name + ' (' + m.email + ')'])),
            inputPlaceholder: 'Select a manager',
            showCancelButton: true,
        });

        if (managerId) {
            const success = await assignManager(teamId, managerId);
            if (success) Swal.fire('Success', 'Manager assigned successfully', 'success');
        }
    };

    const columns = [
        {
            key: 'name',
            title: 'Team Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <UsersIcon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{row.name}</span>
                </div>
            )
        },
        {
            key: 'manager',
            title: 'Manager',
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{row.manager?.name || 'Unassigned'}</p>
                    <p className="text-xs text-gray-500">{row.manager?.email}</p>
                </div>
            )
        },
        {
            key: 'members',
            title: 'Members',
            render: (row) => (
                <div className="flex -space-x-2 overflow-hidden">
                    {row.members?.slice(0, 5).map(m => (
                        <div
                            key={m.id}
                            title={m.name}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300"
                        >
                            {m.name?.[0]}
                        </div>
                    ))}
                    {row.members?.length > 5 && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            +{row.members.length - 5}
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleAddMember(row.id)}>
                        <UserPlusIcon className="w-4 h-4 mr-1" />
                        Add Member
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleAssignManager(row.id)}>
                        <UserCircleIcon className="w-4 h-4 mr-1" />
                        Change Manager
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Create teams and manage organizational structure.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Team
                </Button>
            </div>

            <Table
                columns={columns}
                data={teams}
                isLoading={isLoading}
                expandedRowRender={(row) => (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Team Members</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {row.members?.map(m => (
                                <div key={m.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs">
                                            {m.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p>
                                            <p className="text-xs text-gray-500">{m.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveMember(row.id, m.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            />

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Team</h3>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <Input
                                label="Team Name"
                                placeholder="e.g. Engineering, Marketing"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Assign Manager
                                </label>
                                <select
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500"
                                    value={selectedManagerId}
                                    onChange={(e) => setSelectedManagerId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a manager</option>
                                    {managers.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Create Team
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeamManagement;
