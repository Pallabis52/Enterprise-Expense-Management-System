import React, { useEffect, useState } from 'react';
import usePolicyStore from '../../../store/policyStore';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import PolicyModal from './PolicyModal';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/helpers';

const PolicyList = () => {
    const { policies, isLoading, fetchPolicies, createPolicy, updatePolicy, deletePolicy } = usePolicyStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPolicy, setCurrentPolicy] = useState(null);

    useEffect(() => {
        fetchPolicies(true); // isAdmin = true
    }, []);

    const handleCreate = () => {
        setCurrentPolicy(null);
        setIsModalOpen(true);
    };

    const handleEdit = (policy) => {
        setCurrentPolicy(policy);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data) => {
        let success = false;
        if (currentPolicy) {
            success = await updatePolicy(currentPolicy.id, data);
        } else {
            success = await createPolicy(data);
        }
        if (success) setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            await deletePolicy(id);
        }
    };

    const columns = [
        { key: 'name', title: 'Policy Name', className: 'font-medium' },
        {
            key: 'limits',
            title: 'Limits',
            render: (row) => (
                <div className="text-sm">
                    {row.maxAmount && <div className="text-gray-900 dark:text-gray-200">Max: {formatCurrency(row.maxAmount)}</div>}
                    {row.monthlyLimit && <div className="text-gray-500">Monthly: {formatCurrency(row.monthlyLimit)}</div>}
                </div>
            )
        },
        {
            key: 'requirements',
            title: 'Requirements',
            render: (row) => (
                <div className="flex gap-2">
                    {row.requiresReceipt && <Badge variant="warning">Receipt Required</Badge>}
                </div>
            )
        },
        {
            key: 'status',
            title: 'Status',
            render: (row) => <Badge variant={row.isActive ? 'success' : 'secondary'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>
        },
        {
            key: 'actions',
            title: '',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>
                        <PencilSquareIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}>
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Policies</h1>
                    <p className="text-gray-500 dark:text-gray-400">Define and manage expense rules and limits.</p>
                </div>
                <Button onClick={handleCreate}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Policy
                </Button>
            </div>

            <Table
                columns={columns}
                data={policies}
                isLoading={isLoading}
                emptyMessage="No policies defined yet."
                onRowClick={handleEdit}
            />

            <PolicyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={currentPolicy}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
};

export default PolicyList;
