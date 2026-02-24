import Button from '../ui/Button';
import Input from '../ui/Input';
import VoiceExpenseButton from '../ai/VoiceExpenseButton';
import { enhanceDescription } from '../../services/aiService';
import { SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ExpenseModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: ''
    });
    const [receiptFile, setReceiptFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleVoiceParsed = (data) => {
        setFormData({
            ...formData,
            title: data.title || data.description || formData.title,
            amount: data.amount || formData.amount,
            category: data.category || formData.category,
            description: data.description || formData.description,
            date: data.date || formData.date
        });
    };

    const handleEnhanceDescription = async () => {
        if (!formData.title || !formData.amount) {
            toast.error('Please enter title and amount first');
            return;
        }
        setIsEnhancing(true);
        try {
            const res = await enhanceDescription(formData.title, formData.amount, formData.category);
            if (!res.isFallback) {
                setFormData({ ...formData, description: res.result });
                toast.success('Description boosted!');
            }
        } catch (err) {
            toast.error('AI enhancement failed');
        } finally {
            setIsEnhancing(false);
        }
    };

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await import('../../services/categoryService').then(m => m.default.getAllCategories());
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                amount: initialData.amount || '',
                date: initialData.date || new Date().toISOString().split('T')[0],
                category: initialData.category || '',
                description: initialData.description || ''
            });
        } else {
            setFormData({
                title: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: categories.length > 0 ? categories[0].name : '',
                description: ''
            });
            setReceiptFile(null);
        }
    }, [initialData, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, receiptFile);
    };



    // const categories = ['Food', 'Travel', 'Medical', 'Office', 'Entertainment', 'Others'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {initialData ? 'Edit Expense' : 'Add New Expense'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {!initialData && (
                        <div className="flex justify-center pb-2 border-b border-dashed border-gray-100 dark:border-gray-700 mb-4">
                            <VoiceExpenseButton onParsed={handleVoiceParsed} />
                        </div>
                    )}

                    <Input
                        label="Expense Title"
                        placeholder="e.g., Team Lunch"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Amount (₹)"
                            type="number"
                            min="0"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                        <Input
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="border-2 border-dashed border-primary-100 dark:border-gray-600 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-700/30 hover:border-primary-500 transition-all duration-200">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Upload Bill / Receipt (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setReceiptFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-1 file:px-4
                                file:rounded-full file:border-0
                                file:text-xs file:font-semibold
                                file:bg-primary-100 file:text-primary-700
                                hover:file:bg-primary-200
                                dark:file:bg-gray-600 dark:file:text-primary-300
                                cursor-pointer"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                            Description
                            <button
                                type="button"
                                onClick={handleEnhanceDescription}
                                disabled={isEnhancing}
                                className="text-[10px] flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-tight"
                            >
                                <SparklesIcon className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : ''}`} />
                                {isEnhancing ? 'Boosting...' : 'Boost with AI'}
                            </button>
                        </label>
                        <textarea
                            rows="2"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                            placeholder="Add details about the expense..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            {initialData ? 'Update Expense' : 'Add Expense'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;
