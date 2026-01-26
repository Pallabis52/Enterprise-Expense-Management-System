import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '../../utils/helpers';
import Skeleton from './Skeleton';

const Table = ({
    columns,
    data,
    isLoading = false,
    onSort,
    sortConfig,
    onRowClick,
    emptyMessage = "No data found."
}) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={cn(
                                        "px-6 py-4 first:pl-6 last:pr-6",
                                        column.sortable && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none",
                                        column.className
                                    )}
                                    onClick={() => column.sortable && onSort && onSort(column.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.title}
                                        {sortConfig?.key === column.key && (
                                            <span className="flex-shrink-0 text-primary-500">
                                                {sortConfig.direction === 'asc' ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoading ? (
                            // Loading Skeletons
                            Array.from({ length: 5 }).map((_, idx) => (
                                <tr key={idx}>
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="px-6 py-4">
                                            <Skeleton className="h-4 w-full max-w-[100px]" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data && data.length > 0 ? (
                            data.map((row, rowIdx) => (
                                <tr
                                    key={row.id || rowIdx}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={cn(
                                        "group transition-colors",
                                        onRowClick
                                            ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    )}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={cn("px-6 py-4 text-gray-600 dark:text-gray-300", column.cellClassName)}
                                        >
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
