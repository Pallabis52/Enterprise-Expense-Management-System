import React, { useState } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { naturalSearch } from '../../services/aiService';
import toast from 'react-hot-toast';

/**
 * AISearchBar - Natural language search for expenses.
 * @param {Function} onFilterChange - Callback receiving the filter criteria { category, status, minAmount, maxAmount, dateRange }
 */
const AISearchBar = ({ onFilterChange }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const response = await naturalSearch(query);

            if (response.isFallback) {
                toast.error('AI Search unavailable — using manual search.');
                // Simple manual fallback: filter by title
                onFilterChange({ title: query });
                return;
            }

            // Expecting JSON result from backend: { status, category, dateRange, etc. }
            try {
                const filters = JSON.parse(response.result);
                onFilterChange(filters);
                toast.success('Search filters applied!', {
                    icon: '🪄',
                    duration: 2000
                });
            } catch (err) {
                toast.error('AI result parsing failed.');
                onFilterChange({ title: query });
            }
        } catch (error) {
            toast.error('AI search failed.');
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        onFilterChange({});
    };

    return (
        <form onSubmit={handleSearch} className="relative group w-full max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? (
                    <SparklesIcon className="h-5 w-5 text-indigo-500 animate-pulse" />
                ) : (
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                )}
            </div>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask AI: 'Show my rejected travel expenses above 500'..."
                className="block w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                disabled={isSearching}
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                {query && !isSearching && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                )}

                {!query && (
                    <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-400">
                        <kbd>Enter</kbd>
                    </div>
                )}
            </div>

            {isSearching && (
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <span className="text-[10px] font-medium text-indigo-600 animate-pulse uppercase tracking-widest">
                        AI is analyzing your request...
                    </span>
                </div>
            )}
        </form>
    );
};

export default AISearchBar;
