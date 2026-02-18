import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
            <div className="bg-blue-50 p-6 rounded-full mb-6 animate-pulse">
                <Construction size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title} Module</h2>
            <p className="text-gray-500 max-w-md">
                This Enterprise module is currently under development.
                Features for {title.toLowerCase()} management will be available in the next update.
            </p>
            <button className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Return to Dashboard
            </button>
        </div>
    );
};

export default PlaceholderPage;
