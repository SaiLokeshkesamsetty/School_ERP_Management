import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
    User,
    Calendar,
    MessageSquare,
    TrendingUp,
    Bell,
    ChevronRight,
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from 'recharts';

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-[16px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                <Icon size={24} className={`${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${parseFloat(trend) > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {parseFloat(trend) > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
    </div>
);

const ParentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard/parent');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch parent dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-900">No student linked to this account</h2>
                <p className="text-gray-500 mt-2">Please contact the administrator to map your student.</p>
            </div>
        );
    }

    const { studentInfo, stats, charts, recentResults, announcements } = data;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Top Section – Child Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Child Name & Class"
                    value={studentInfo.name}
                    subtitle={studentInfo.class}
                    icon={User}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${stats.attendance}%`}
                    subtitle="Overall student attendance"
                    icon={Calendar}
                    color="bg-emerald-600"
                    trend={2.4} // Mock trend for now
                />
                <StatCard
                    title="Average Score"
                    value={stats.avgScore}
                    subtitle={`GPA Equivalent: ${stats.gpa}`}
                    icon={TrendingUp}
                    color="bg-purple-600"
                    trend={1.2} // Mock trend for now
                />
                <StatCard
                    title="Unread Messages"
                    value={`${stats.unreadMessages} New`}
                    subtitle="Communication from school"
                    icon={MessageSquare}
                    color="bg-amber-600"
                />
            </div>

            {/* Middle Section – Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Trend */}
                <div className="bg-white rounded-[16px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Attendance Trend</h3>
                            <p className="text-sm text-gray-500">Activity over the last 7 sessions</p>
                        </div>
                        <button className="text-blue-600 text-sm font-semibold hover:underline flex items-center">
                            Full Report <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.attendanceTrend}>
                                <defs>
                                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="attendance"
                                    stroke="#2563EB"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAttendance)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Performance */}
                <div className="bg-white rounded-[16px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Subject Performance</h3>
                            <p className="text-sm text-gray-500">Latest assessment scores</p>
                        </div>
                        <button className="text-blue-600 text-sm font-semibold hover:underline flex items-center">
                            Analytics <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.subjectPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="subject"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F8FAFC' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar
                                    dataKey="score"
                                    fill="#6366F1"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section – Activity & Communication */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Results Table */}
                <div className="lg:col-span-2 bg-white rounded-[16px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Recent Exam Results</h3>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 font-semibold text-gray-600 text-sm">Subject</th>
                                    <th className="pb-4 font-semibold text-gray-600 text-sm">Exam Type</th>
                                    <th className="pb-4 font-semibold text-gray-600 text-sm">Score</th>
                                    <th className="pb-4 font-semibold text-gray-600 text-sm">Grade</th>
                                    <th className="pb-4 font-semibold text-gray-600 text-sm">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentResults.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 text-sm font-medium text-gray-900">{row.sub}</td>
                                        <td className="py-4 text-sm text-gray-500">{row.type}</td>
                                        <td className="py-4 text-sm font-semibold text-gray-900">{row.score}</td>
                                        <td className="py-4">
                                            <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md">{row.grade}</span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentResults.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">No exam results available yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Announcements Panel */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[16px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <Bell size={20} className="mr-2 text-blue-600" /> Announcements
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {announcements.map((ann, i) => (
                                <div key={ann.id} className="p-4 bg-blue-50 bg-opacity-50 rounded-xl border border-blue-100 group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{ann.title}</h4>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase">{ann.date}</span>
                                    </div>
                                    <p className="text-gray-600 text-xs leading-relaxed">{ann.content}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-sm font-semibold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            View All Notifications
                        </button>
                    </div>

                    {/* Mini Calendar Widget */}
                    <div className="bg-[#0F172A] rounded-[16px] p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
                        <h3 className="text-sm font-semibold mb-4 text-blue-400 uppercase tracking-wider">Academic Calendar</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex flex-col items-center justify-center mr-4 border border-white/10">
                                    <span className="text-[10px] uppercase font-bold text-blue-300">Mar</span>
                                    <span className="text-sm font-bold">22</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Final Term Exams</p>
                                    <p className="text-xs text-blue-100/60">Starts at 10:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
