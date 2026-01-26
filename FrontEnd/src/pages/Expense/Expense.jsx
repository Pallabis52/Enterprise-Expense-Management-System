import { Card } from "flowbite-react";

export default function Expense() {
    return (
        <div className="flex flex-col items-center">


            {/* Card */}
            <div className="mt-6">
                <Card href="#" className="max-w-sm rounded-lg shadow-lg">
                    <div className="p-5">
                        <p className="text-lg font-bold text-center">Add Expense</p>
                        <div className="flex items-center justify-center mt-4">
                            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md bg-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-black"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
