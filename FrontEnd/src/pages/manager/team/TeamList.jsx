import React, { useEffect } from 'react';
import useTeamStore from '../../../store/teamStore';
import Skeleton from '../../../components/ui/Skeleton';
import { UserIcon, EnvelopeIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const TeamList = () => {
    const { members, fetchTeamMembers, isLoading } = useTeamStore();

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const TeamCard = ({ member }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                    {member.name?.[0] || 'U'}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role || 'Team Member'}</p>

                <div className="w-full border-t border-gray-100 dark:border-gray-700 my-4"></div>

                <div className="w-full space-y-2 text-left">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <BriefcaseIcon className="w-4 h-4 mr-2" />
                        <span>Joined: {new Date(member.joinDate || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>

                <button className="mt-4 w-full py-2 bg-gray-50 dark:bg-gray-700/50 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                    View History
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Team</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage assigned team members.</p>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                    Total: {members.length}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.length > 0 ? (
                        members.map(member => <TeamCard key={member.id} member={member} />)
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            No team members assigned yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeamList;
