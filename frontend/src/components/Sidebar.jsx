import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    UserCheck,
    School,
    CalendarCheck,
    ClipboardList,
    Award,
    MessageSquare,
    UserCog,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';


const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const adminMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Students', path: '/students' },
        { icon: GraduationCap, label: 'Teachers', path: '/teachers' },
        { icon: UserCheck, label: 'Parents', path: '/parents' },
        { icon: School, label: 'Classes', path: '/classes' },
        { icon: CalendarCheck, label: 'Attendance', path: '/admin/attendance' },
        { icon: ClipboardList, label: 'Exams', path: '/admin/exams' },
        { icon: Award, label: 'Results', path: '/admin/results' },
        { icon: MessageSquare, label: 'Communication', path: '/communication' },
        { icon: UserCog, label: 'User Management', path: '/admin/users' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const teacherMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Students', path: '/students' },
        { icon: CalendarCheck, label: 'Time Table', path: '/teacher/timetable' },
        { icon: CalendarCheck, label: 'Mark Attendance', path: '/teacher/attendance' },
        { icon: ClipboardList, label: 'Enter Marks', path: '/teacher/marks' },
        { icon: MessageSquare, label: 'Announcements', path: '/announcements' },
    ];

    const studentMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: CalendarCheck, label: 'Time Table', path: '/student/timetable' },
        { icon: CalendarCheck, label: 'My Attendance', path: '/student/attendance' },
        { icon: Award, label: 'My Results', path: '/student/results' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
    ];

    const parentMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Child Profile', path: '/parent/profile' },
        { icon: ClipboardList, label: 'Time Table', path: '/student/timetable' },
        { icon: CalendarCheck, label: 'Attendance', path: '/student/attendance' },
        { icon: Award, label: 'Results', path: '/student/results' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: MessageSquare, label: 'Announcements', path: '/announcements' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const getMenuItems = () => {
        switch (user?.role) {
            case 'admin': return adminMenuItems;
            case 'teacher': return teacherMenuItems;
            case 'student': return studentMenuItems;
            case 'parent': return parentMenuItems;
            default: return [];
        }
    };

    const menuItems = getMenuItems();

    return (
        <div
            className={`flex flex-col h-screen bg-[#0F172A] text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-[280px]'} shadow-2xl relative z-40`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-9 bg-white text-[#0F172A] p-1.5 rounded-full shadow-lg hover:bg-gray-50 transition-all z-50 border border-gray-100"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo Section */}
            <div className="flex items-center px-6 h-20 border-b border-white/5 bg-[#0F172A]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <School size={22} className="text-white" />
                </div>
                {!collapsed && (
                    <div className="ml-4 animate-fade-in">
                        <h2 className="text-lg font-bold tracking-tight text-white leading-tight">School <span className="text-blue-500">ERP</span></h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Premium Portal</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                <ul className="space-y-1.5 px-3">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={index} className="relative group">
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                                )}
                                <Link
                                    to={item.path}
                                    className={`
                                        flex items-center px-4 py-3 rounded-xl transition-all duration-200
                                        ${isActive
                                            ? 'bg-blue-600/10 text-blue-400 font-bold'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }
                                        ${collapsed ? 'justify-center mx-1' : 'mx-2'}
                                    `}
                                    title={collapsed ? item.label : ''}
                                >
                                    <Icon size={20} className={`transition-colors ${isActive ? 'text-blue-500' : 'group-hover:text-blue-400'}`} />
                                    {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-white/5 bg-[#0F172A]/50 backdrop-blur-sm">
                <button
                    onClick={logout}
                    className={`
                        flex items-center w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group
                        ${collapsed ? 'justify-center' : ''}
                    `}
                    title="Logout"
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    {!collapsed && <span className="ml-3 font-semibold">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
