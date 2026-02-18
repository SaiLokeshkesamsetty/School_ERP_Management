
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import {
    Calendar,
    BookOpen,
    User,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';

const AttendanceView = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, present: 0, percentage: 0 });

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const response = await api.get('/attendance/my-attendance');
            setAttendance(response.data);

            // Calculate Stats (unique by date and subject)
            const total = response.data.length;
            const present = response.data.filter(a => a.status === 'Present').length;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
            setStats({ total, present, percentage });

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch attendance', error);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Attendance Record</h2>
                    <p className="text-gray-500 mt-1">Review your presence across all subjects and sessions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-blue-50 p-4 rounded-2xl mr-4">
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Sessions</h3>
                        <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-emerald-50 p-4 rounded-2xl mr-4">
                        <CheckCircle2 className="text-emerald-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Present</h3>
                        <p className="text-2xl font-black text-emerald-600">{stats.present}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-purple-50 p-4 rounded-2xl mr-4">
                        <Clock className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Overall %</h3>
                        <p className={`text-2xl font-black ${Number(stats.percentage) < 75 ? 'text-rose-600' : 'text-purple-600'}`}>
                            {stats.percentage}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Marked By</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {attendance.length > 0 ? (
                                attendance.map((record) => (
                                    <tr key={record.id} className="hover:bg-blue-50/10 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="font-bold text-gray-900">
                                                {new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-2">
                                                <BookOpen size={14} className="text-blue-500" />
                                                <span className="font-bold text-gray-700">{record.subject}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-2">
                                                <User size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">{record.teacher_name || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                    record.status === 'Absent' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                                        'bg-amber-100 text-amber-700 border border-amber-200'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-12 text-center text-gray-400 font-medium italic">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;
