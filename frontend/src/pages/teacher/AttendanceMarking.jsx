
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Calendar,
    BookOpen,
    User,
    CheckCircle,
    AlertCircle,
    Save
} from 'lucide-react';

const AttendanceMarking = () => {
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusMap, setStatusMap] = useState({});
    const [isPosted, setIsPosted] = useState(false);
    const [stats, setStats] = useState({ present: 0, absent: 0 });

    const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

    useEffect(() => {
        if (subject) {
            fetchData();
        } else {
            setStudents([]);
            setLoading(false);
        }
    }, [date, subject]);

    useEffect(() => {
        // Calculate stats whenever statusMap changes
        const present = Object.values(statusMap).filter(s => s === 'Present').length;
        const absent = Object.values(statusMap).filter(s => s === 'Absent').length;
        setStats({ present, absent });
    }, [statusMap]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsRes, attendanceRes] = await Promise.all([
                api.get('/students'),
                api.get(`/attendance/report?date=${date}`)
            ]);

            setStudents(studentsRes.data);

            // Filter attendance for the CURRENT teacher's subject on this date
            // Note: Backend report includes teacher_id. We might need current teacher id to filter perfectly on frontend
            // but for now, we'll assume the marking UI should show what this specific teacher has marked.
            // Actually, markAttendance controller already handles "update if exists" for the same teacher/subject.

            const existingAttendance = {};
            // We need to know who the logged-in teacher is to filter their specific entries if multiple teachers mark for same subject (unlikely)
            // For now, let's just find records for this subject and date
            const filteredRecords = attendanceRes.data.filter(r => r.subject === subject);

            filteredRecords.forEach(record => {
                existingAttendance[record.student_id] = record.status;
            });

            const initialStatus = {};
            studentsRes.data.forEach(student => {
                initialStatus[student.id] = existingAttendance[student.id] || 'Present';
            });

            setStatusMap(initialStatus);
            setIsPosted(filteredRecords.length > 0);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setStatusMap({ ...statusMap, [studentId]: status });
        setIsPosted(false); // Allow re-submitting if edited
    };

    const handleSubmit = async () => {
        if (!subject) {
            alert('Please select a subject first.');
            return;
        }
        try {
            const promises = Object.keys(statusMap).map(studentId => {
                return api.post('/attendance', {
                    student_id: studentId,
                    date: date,
                    status: statusMap[studentId],
                    subject: subject
                });
            });
            await Promise.all(promises);
            setIsPosted(true);
            alert(`Attendance for ${subject} marked successfully`);
        } catch (error) {
            console.error('Failed to mark attendance', error);
            alert('Failed to mark attendance');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Mark Attendance</h2>
                    <p className="text-gray-500 mt-1">Select subject and date to record student presence</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                        <Calendar size={18} className="text-blue-500 mr-2" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="text-sm font-bold bg-transparent outline-none cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                        <BookOpen size={18} className="text-emerald-500 mr-2" />
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="text-sm font-bold bg-transparent outline-none cursor-pointer min-w-[150px]"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {subject ? (
                loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading class list...</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Ribbon */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Students</p>
                                <p className="text-2xl font-black text-gray-900">{students.length}</p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Present</p>
                                <p className="text-2xl font-black text-emerald-700">{stats.present}</p>
                            </div>
                            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm">
                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Absent</p>
                                <p className="text-2xl font-black text-rose-700">{stats.absent}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center text-blue-700 font-bold">
                                    {isPosted ? (
                                        <><CheckCircle size={16} className="mr-1.5" /> Saved</>
                                    ) : (
                                        <><AlertCircle size={16} className="mr-1.5" /> Pending</>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll No</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Attendance Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {students.map(student => (
                                        <tr key={student.id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black mr-4 group-hover:scale-110 transition-transform">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-gray-900">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                    #{student.roll_no}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {['Present', 'Absent', 'Late'].map(opt => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => handleStatusChange(student.id, opt)}
                                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all border-2 ${statusMap[student.id] === opt
                                                                    ? opt === 'Present' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' :
                                                                        opt === 'Absent' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' :
                                                                            'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200'
                                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                                                }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleSubmit}
                                className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl ${isPosted
                                        ? 'bg-gray-100 text-gray-400 cursor-default'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 active:scale-95 shadow-blue-200'
                                    }`}
                            >
                                <Save size={18} />
                                <span>{isPosted ? 'Attendance Saved' : 'Update Attendance'}</span>
                            </button>
                        </div>
                    </div>
                )
            ) : (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] py-32 flex flex-col items-center justify-center text-center px-4">
                    <div className="bg-blue-50 p-6 rounded-full mb-6">
                        <BookOpen size={48} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Ready to take rolls?</h3>
                    <p className="text-gray-500 max-w-sm">Please select a subject from the top menu to start marking attendance for today's session.</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceMarking;
