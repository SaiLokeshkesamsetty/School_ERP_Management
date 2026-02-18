import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Users,
    Calendar,
    BookOpen,
    FileText,
    Bell,
    Search,
    ChevronDown,
    ArrowUpRight,
    Clock,
    MoreHorizontal
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const TeacherDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        attendance: 0,
        classes: 0,
        pendingMarks: 0
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [classPerformanceData, setClassPerformanceData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard/teacher');
            const data = response.data;
            setStats(data.stats);
            setAttendanceData(data.charts.attendance);
            setClassPerformanceData(data.charts.classPerformance);
            setRecentActivity(data.recentActivity);
            setAnnouncements(data.announcements);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Top Navbar */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center w-full max-w-md">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search for students, classes, or documents..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-inter"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                            T
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-800">Teacher Account</p>
                            <p className="text-xs text-gray-500">Science Dept.</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-inter">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, get up to date with your classroom progress.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Total Students */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Students</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">{stats.students}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Users size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium flex items-center">
                                <ArrowUpRight size={14} className="mr-1" /> +12%
                            </span>
                            <span className="text-gray-400 ml-2">from last month</span>
                        </div>
                    </div>

                    {/* Card 2: Today's Attendance */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Attendance</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-emerald-600 transition-colors">{stats.attendance}%</h3>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Calendar size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium flex items-center">
                                <ArrowUpRight size={14} className="mr-1" /> +2%
                            </span>
                            <span className="text-gray-400 ml-2">average today</span>
                        </div>
                    </div>

                    {/* Card 3: Classes Assigned */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Classes Assigned</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-purple-600 transition-colors">{stats.classes}</h3>
                            </div>
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <BookOpen size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-gray-400">Next class: </span>
                            <span className="font-medium text-gray-700 ml-2">10:30 AM (Class 9B)</span>
                        </div>
                    </div>

                    {/* Card 4: Pending Marks */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending Marks</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-amber-600 transition-colors">{stats.pendingMarks}</h3>
                            </div>
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <FileText size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                Action Required
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Attendance Trend Line Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Attendance Trend</h3>
                            <select className="bg-gray-50 border-none text-sm text-gray-500 font-medium rounded-lg px-3 py-1 outline-none">
                                <option>This Week</option>
                                <option>Last Week</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                                    />
                                    <Line type="monotone" dataKey="attendance" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Class Performance Bar Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Class Performance (Avg Score)</h3>
                            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View Details</button>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={classPerformanceData} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#F1F5F9' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Recent Activity & Announcements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <Clock size={20} className="mr-2 text-gray-400" /> Recent Activity
                            </h3>
                            <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {recentActivity.map((activity, i) => (
                                <div key={activity.id || i} className="flex items-start">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${i % 3 === 0 ? 'bg-blue-100 text-blue-600' : i % 3 === 1 ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {i % 3 === 0 ? <FileText size={18} /> : i % 3 === 1 ? <Users size={18} /> : <Calendar size={18} />}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {activity.text}
                                            </p>
                                            <span className="text-xs text-gray-400">{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">No recent activity.</p>
                            )}
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <Bell size={20} className="mr-2 text-gray-400" /> Announcements
                        </h3>
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md shadow-sm ${announcement.type === 'Academic' ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50'}`}>
                                            {announcement.type}
                                        </span>
                                        <span className="text-xs text-gray-400">{announcement.time}</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{announcement.title}</h4>
                                    <p className="text-gray-600 text-xs leading-relaxed">{announcement.content}</p>
                                </div>
                            ))}
                            {announcements.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">No announcements.</p>
                            )}

                            <button className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-200 mt-2">
                                View All Announcements
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
