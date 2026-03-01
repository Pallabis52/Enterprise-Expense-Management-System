import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAdminTeamStore from '../../../store/adminTeamStore';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import {
    UsersIcon,
    UserPlusIcon,
    PlusIcon,
    TrashIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    IdentificationIcon,
    ArrowUpRightIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { premiumSuccess, premiumError, premiumConfirm, showPremiumAlert } from '../../../utils/premiumAlerts';
import PageTransition from '../../../components/layout/PageTransition';

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
            premiumSuccess('STRUCTURAL UPDATE', 'New organizational unit initialized successfully');
        }
    };

    const handleAddMember = async (teamId) => {
        const { value: userId } = await showPremiumAlert({
            title: 'ENROLL PERSONNEL',
            text: 'Select operative for deployment',
            input: 'select',
            inputOptions: Object.fromEntries(availableUsers.map(u => [u.id, u.name + ' (' + u.email + ')'])),
            inputPlaceholder: 'Select an operative',
            showCancelButton: true,
            confirmButtonText: 'Enroll',
        });

        if (userId) {
            const success = await addMember(teamId, userId);
            if (success) {
                premiumSuccess('DEPLOYMENT COMPLETE', 'Operative enrolled successfully', 1500);
            }
        }
    };

    const handleRemoveMember = async (teamId, userId) => {
        const result = await premiumConfirm('DECOMMISSION OPERATIVE?', "Final removal from organizational unit", 'Execute Removal');

        if (result.isConfirmed) {
            const success = await removeMember(teamId, userId);
            if (success) {
                premiumSuccess('OPERATIVE REMOVED', 'Operative decommissioned successfully');
            }
        }
    };

    const handleAssignManager = async (teamId) => {
        const { value: managerId } = await showPremiumAlert({
            title: 'AUTHORITY TRANSFER',
            text: 'Assign new executive oversight',
            input: 'select',
            inputOptions: Object.fromEntries(managers.map(m => [m.id, m.name + ' (' + m.email + ')'])),
            inputPlaceholder: 'Select an executive',
            showCancelButton: true,
            confirmButtonText: 'Transfer',
        });

        if (managerId) {
            const success = await assignManager(teamId, managerId);
            if (success) {
                premiumSuccess('AUTHORITY UPDATED', 'Executive oversight transferred successfully');
            }
        }
    };

    const columns = [
        {
            key: 'name',
            title: 'Unit Identity',
            render: (row) => (
                <div className="flex items-center gap-4">
                    <div className="relative group/icon">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover/icon:opacity-50 transition duration-500" />
                        <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-white/20 dark:border-white/5 flex items-center justify-center text-indigo-500 shadow-lg transition-transform group-hover/icon:scale-110">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <span className="block font-black text-slate-900 dark:text-white uppercase tracking-tighter text-base leading-tight">{row.name}</span>
                        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.2em]">Operational Sector</span>
                    </div>
                </div>
            )
        },
        {
            key: 'manager',
            title: 'Executive Oversight',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-white/10">
                        <UserCircleIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{row.manager?.name || 'Unassigned'}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{row.manager?.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'members',
            title: 'Personnel Count',
            render: (row) => (
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                        {row.members?.slice(0, 4).map(m => (
                            <div
                                key={m.id}
                                title={m.name}
                                className="inline-block h-10 w-10 rounded-full ring-4 ring-white dark:ring-slate-900 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-[11px] font-black text-slate-600 dark:text-slate-300 border border-white/10"
                            >
                                {m.name?.[0]}
                            </div>
                        ))}
                        {row.members?.length > 4 && (
                            <div className="inline-block h-10 w-10 rounded-full ring-4 ring-white dark:ring-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                                +{row.members.length - 4}
                            </div>
                        )}
                    </div>
                    <Badge variant="indigo" className="bg-indigo-500/10 text-indigo-500 font-black text-[10px] tracking-widest px-3 py-1">
                        {row.members?.length || 0} TOTAL
                    </Badge>
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Command Vectors',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => handleAddMember(row.id)}
                        className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-sm"
                        title="Enroll Personnel"
                    >
                        <UserPlusIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleAssignManager(row.id)}
                        className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-sm"
                        title="Transfer Authority"
                    >
                        <ShieldCheckIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-6">

                {/* ── Structural Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-5"
                        >
                            <div className="p-5 rounded-[24px] bg-slate-900 dark:bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20">
                                <IdentificationIcon className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Structure Hub</h1>
                                <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Organizational Architecture Matrix
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="rounded-[24px] px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <PlusIcon className="w-6 h-6" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Initialize Unit</span>
                        </Button>
                    </motion.div>
                </div>

                {/* ── Data Matrix ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1.5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[40px] blur-2xl opacity-50" />
                    <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden p-2">
                        <Table
                            columns={columns}
                            data={teams}
                            isLoading={isLoading}
                            className="bg-transparent border-none"
                            expandedRowRender={(row) => (
                                <div className="p-10 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/20 rounded-[32px] m-6 border border-white/40 dark:border-white/10 shadow-inner">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-5">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                                                <UsersIcon className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Assigned Personnel</h4>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                            Sector: {row.name}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {row.members?.map(m => (
                                            <motion.div
                                                layout
                                                key={m.id}
                                                className="flex justify-between items-center bg-white/60 dark:bg-slate-800/40 p-5 rounded-2xl border border-white dark:border-white/5 shadow-sm group/card hover:border-indigo-500/30 transition-all duration-500"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center font-black text-[10px] shadow-lg">
                                                        {m.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{m.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold">{m.email}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveMember(row.id, m.id); }}
                                                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover/card:opacity-100"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </motion.div>

                {/* ── Structural Initialization Modal ── */}
                <AnimatePresence>
                    {isCreateModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCreateModalOpen(false)}
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative bg-white dark:bg-slate-900/90 rounded-[40px] w-full max-w-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

                                <div className="p-10 md:p-14 space-y-10">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Initialize Command Unit</h3>
                                            <p className="text-[11px] text-indigo-500 font-black uppercase tracking-[0.3em]">Define structural parameters</p>
                                        </div>
                                        <button
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-indigo-500 transition-colors"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleCreateTeam} className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Unit Designation</label>
                                            <Input
                                                placeholder="e.g. STRATEGIC OPERATIONS"
                                                className="rounded-[20px] h-14 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 uppercase font-black tracking-tight"
                                                value={newTeamName}
                                                onChange={(e) => setNewTeamName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <CustomDropdown
                                                label="Executive Oversight"
                                                options={managers.map(m => ({
                                                    label: m.name,
                                                    value: m.id,
                                                    description: m.email
                                                }))}
                                                value={selectedManagerId}
                                                onChange={setSelectedManagerId}
                                                className="z-[110]"
                                            />
                                        </div>

                                        <div className="pt-6">
                                            <Button
                                                type="submit"
                                                className="w-full py-6 rounded-[24px] bg-slate-900 dark:bg-indigo-600 font-black uppercase tracking-[0.25em] text-xs shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                                            >
                                                Confirm Initialization
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default AdminTeamManagement;
