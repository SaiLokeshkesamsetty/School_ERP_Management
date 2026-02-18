
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Calendar,
    Users,
    User,
    BookOpen,
    Search,
    Filter,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Download
} from 'lucide-react';

const AttendanceManagement = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [classId, setClassId] = useState('');
    const [classes, setClasses] = useState([]);
    const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [date, classId]);

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            let url = `/attendance/report?date=${date}`;
            if (classId) url += `&class_id=${classId}`;

            const response = await api.get(url);
            setAttendance(response.data);

            // Calculate daily stats
            const present = response.data.filter(a => a.status === 'Present').length;
            const absent = response.data.filter(a => a.status === 'Absent').length;
            setStats({ present, absent, total: response.data.length });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance report:', error);
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                        <Calendar className="text-blue-600 mr-3" size={32} />
                        Attendance Reports
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Monitor student presence across all classes and subjects</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-blue-600 font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
                        <Download size={16} />
                        <span>Export PDF</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                        <FileText size={16} />
                        <span>Print Report</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center h-32">
                    <div className="bg-blue-50 p-4 rounded-2xl mr-4">
                        <Users className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Checked</h3>
                        <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center h-32">
                    <div className="bg-white p-4 rounded-2xl mr-4 shadow-sm">
                        <CheckCircle2 className="text-emerald-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-emerald-600/50 uppercase tracking-widest mb-1">Present Today</h3>
                        <p className="text-3xl font-black text-emerald-700">{stats.present}</p>
                    </div>
                </div>
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center h-32">
                    <div className="bg-white p-4 rounded-2xl mr-4 shadow-sm">
                        <XCircle className="text-rose-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-rose-600/50 uppercase tracking-widest mb-1">Absent Today</h3>
                        <p className="text-3xl font-black text-rose-700">{stats.absent}</p>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-3 flex-1 min-w-[200px]">
                    <div className="bg-gray-50 p-2.5 rounded-xl">
                        <Filter className="text-gray-400" size={20} />
                    </div>
                    <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        className="bg-transparent font-black text-gray-700 outline-none w-full text-sm uppercase tracking-tight"
                    >
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section})` : ''}</option>)}
                    </select>
                </div>

                <div className="flex items-center space-x-3 flex-1 min-w-[200px]">
                    <div className="bg-gray-50 p-2.5 rounded-xl">
                        <Clock className="text-gray-400" size={20} />
                    </div>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent font-black text-gray-700 outline-none w-full text-sm"
                    />
                </div>

                <div className="flex items-center space-x-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                    <span>Showing {attendance.length} Records</span>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] items-center">
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest">Roll / ID</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest">Marked By</th>
                                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Updating Records...</p>
                                    </td>
                                </tr>
                            ) : attendance.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Search size={48} className="mx-auto text-gray-100 mb-4" />
                                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No attendance records found for this selection.</p>
                                    </td>
                                </tr>
                            ) : (
                                attendance.map((record) => (
                                    <tr key={record.id} className="hover:bg-blue-50/10 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                #{record.roll_no || record.student_id}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black mr-4 group-hover:scale-110 transition-transform">
                                                    {record.student_name?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{record.student_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2">
                                                <BookOpen size={14} className="text-blue-500 opacity-60" />
                                                <span className="font-bold text-gray-600 text-sm">{record.subject}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2">
                                                <User size={14} className="text-gray-300" />
                                                <span className="text-sm font-medium text-gray-500 italic">Prof. {record.teacher_name || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight inline-block border-2 ${record.status === 'Present' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                record.status === 'Absent' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                    'bg-amber-50 border-amber-100 text-amber-600'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceManagement;
