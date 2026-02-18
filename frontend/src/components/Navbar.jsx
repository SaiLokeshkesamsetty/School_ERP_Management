
import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
            {/* Search Bar */}
            <div className="flex-1 max-w-md relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search for resources, grades, attendance..."
                    className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all group">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-100 group-hover:animate-ping"></span>
                </button>

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-gray-100"></div>

                {/* User Profile */}
                <div className="flex items-center gap-4 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user?.username || 'Parent User'}</p>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{user?.role || 'Parent'}</p>
                    </div>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">
                            {user?.username?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
