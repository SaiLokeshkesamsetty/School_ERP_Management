
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Users, GraduationCap, Calendar, FileText, ArrowUpRight, ArrowDownRight, Bell, Clock } from 'lucide-react';
import TeacherDashboard from './teacher/TeacherDashboard';
import StudentDashboard from './student/StudentDashboard';
import ParentDashboard from './parent/ParentDashboard';

const StatCard = ({ title, value, icon: Icon, color, link, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trend > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-4">{value}</p>
        {link && (
            <Link to={link} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center group">
                View Details <ArrowUpRight size={16} className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
        )}
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        attendanceToday: 0,
        examsUpcoming: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            if (user.role === 'admin') {
                const studentsRes = await api.get('/students');
                const teachersRes = await api.get('/teachers');
                // Mocking other stats for now as endpoints might not exist yet
                setStats({
                    students: studentsRes.data.length || 0,
                    teachers: teachersRes.data.length || 0,
                    attendanceToday: 95,
                    examsUpcoming: 3
                });
            }
            // Add other role logic here
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch stats', error);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (user.role === 'teacher') {
        return <TeacherDashboard />;
    }

    if (user.role === 'parent') {
        return <ParentDashboard />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your school's performance</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Admin Stats Grid */}
            {user.role === 'admin' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Students"
                            value={stats.students}
                            icon={Users}
                            color="bg-blue-500"
                            link="/students"
                            trend={12}
                        />
                        <StatCard
                            title="Total Teachers"
                            value={stats.teachers}
                            icon={GraduationCap}
                            color="bg-emerald-500"
                            link="/teachers"
                            trend={5}
                        />
                        <StatCard
                            title="Avg. Attendance"
                            value={`${stats.attendanceToday}%`}
                            icon={Calendar}
                            color="bg-violet-500"
                            link="/admin/attendance"
                            trend={-2}
                        />
                        <StatCard
                            title="Upcoming Exams"
                            value={stats.examsUpcoming}
                            icon={FileText}
                            color="bg-amber-500"
                            link="/admin/exams"
                        />
                    </div>

                    {/* Recent Activity / Announcements Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions / Recent Activity */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Clock size={20} className="mr-2 text-gray-400" /> Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {/* Mock Activity Items */}
                                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
                                    <p className="text-sm text-gray-600 flex-1">New student <span className="font-medium text-gray-900">John Doe</span> registered.</p>
                                    <span className="text-xs text-gray-400">2 mins ago</span>
                                </div>
                                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-4"></div>
                                    <p className="text-sm text-gray-600 flex-1">Teacher <span className="font-medium text-gray-900">Sarah Smith</span> uploaded marks.</p>
                                    <span className="text-xs text-gray-400">1 hour ago</span>
                                </div>
                                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-4"></div>
                                    <p className="text-sm text-gray-600 flex-1">Physics Exam schedule updated.</p>
                                    <span className="text-xs text-gray-400">3 hours ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Announcements */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Bell size={20} className="mr-2 text-gray-400" /> Announcements
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-semibold text-blue-900 text-sm mb-1">School Sports Day</h4>
                                    <p className="text-blue-700 text-xs">Annual sports day scheduled for next Friday.</p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <h4 className="font-semibold text-yellow-900 text-sm mb-1">Exam Schedule Released</h4>
                                    <p className="text-yellow-700 text-xs">Mid-term exam dates have been published.</p>
                                </div>
                                <Link to="/announcements" className="block text-center text-sm font-medium text-gray-500 hover:text-blue-600 mt-4 transition-colors">
                                    View All Announcements
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Fallback for other roles (Teacher/Student) - simplified for now */}
            {user.role === 'student' && <StudentDashboard />}
        </div>
    );
};

export default Dashboard;
