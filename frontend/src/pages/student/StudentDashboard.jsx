
import React, { useEffect, useState } from 'react';
import {
    Calendar,
    TrendingUp,
    BookOpen,
    MessageSquare,
    Bell,
    ChevronRight,
    Award,
    Clock,
    User,
    ArrowUpRight
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
    Cell
} from 'recharts';
import api from '../../utils/api';

const StatCard = ({ title, value, subValue, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-semibold">
                    <ArrowUpRight size={14} className="mr-1" /> {trend}
                </div>
            )}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
    </div>
);

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard/student');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch student dashboard data', error);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!data) return <div>Failed to load dashboard data.</div>;

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Top Bar / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Portal</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Attendance"
                    value={`${data.stats.attendance}%`}
                    subValue="Overall attendance"
                    icon={Calendar}
                    color="bg-blue-600"
                    trend="+2.5%"
                />
                <StatCard
                    title="Average Score"
                    value={data.stats.avgScore}
                    subValue="Across all subjects"
                    icon={Award}
                    color="bg-emerald-600"
                    trend="+5.2%"
                />
                <StatCard
                    title="Upcoming Exams"
                    value={data.stats.upcomingExams}
                    subValue="Next 30 days"
                    icon={BookOpen}
                    color="bg-amber-600"
                />
                <StatCard
                    title="Unread Messages"
                    value={data.stats.unreadMessages}
                    subValue="Check your inbox"
                    icon={MessageSquare}
                    color="bg-rose-600"
                />
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Trend */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <TrendingUp size={20} className="mr-2 text-blue-500" /> Attendance History
                        </h3>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.charts.attendanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="status"
                                    stroke="#3B82F6"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Performance */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <Award size={20} className="mr-2 text-emerald-500" /> Academic Performance
                        </h3>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.charts.subjectPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                                    {data.charts.subjectPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Results */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">Recent Results</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Grade</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.recentResults.map((result, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-700">{result.subject}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{result.marks}/100</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-black">
                                                {result.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center text-emerald-600 text-xs font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                                                Passed
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {data.recentResults.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">No recent results found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Announcements Panel */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <Bell size={20} className="mr-2 text-rose-500" /> Board News
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {data.announcements.map((ann, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all cursor-pointer group">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{ann.date}</p>
                                <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{ann.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-2xl transition-all tracking-widest uppercase">
                        Access All News
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
