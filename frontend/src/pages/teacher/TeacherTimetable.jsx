
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Calendar,
    Clock,
    BookOpen,
    Info
} from 'lucide-react';

const TeacherTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const response = await api.get('/teachers/my-timetable');
            setTimetable(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching timetable:', error);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Weekly Timetable</h1>
                    <p className="text-gray-500 mt-1">View your assigned teaching periods across all classes</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center space-x-2">
                    <Calendar size={18} />
                    <span>Academic Year 2025-26</span>
                </div>
            </div>

            {/* Info Alert */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 text-amber-800">
                <Info size={20} className="mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                    <p className="font-bold">Automated Schedule</p>
                    <p className="opacity-90">This timetable is managed by the school administration. If you notice any conflicts or missing periods, please contact the coordinator.</p>
                </div>
            </div>

            {/* Timetable Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Day</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class & Section</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {days.map(day => {
                                const dayEntries = timetable.filter(t => t.day === day);
                                if (dayEntries.length === 0) {
                                    return (
                                        <tr key={day}>
                                            <td className="px-6 py-4 font-bold text-gray-900 bg-gray-50/30 w-32">{day}</td>
                                            <td colSpan="3" className="px-6 py-4 text-xs text-gray-400 italic">No periods assigned</td>
                                        </tr>
                                    );
                                }
                                return dayEntries.map((entry, idx) => (
                                    <tr key={entry.id} className="hover:bg-blue-50/30 transition-colors">
                                        {idx === 0 && (
                                            <td rowSpan={dayEntries.length} className="px-6 py-4 font-bold text-gray-900 bg-gray-50/30 border-r border-gray-50 align-top w-32">
                                                {day}
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-xs font-bold text-gray-600 space-x-2">
                                                <Clock size={14} className="text-blue-500" />
                                                <span>{entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <BookOpen size={16} className="text-emerald-500" />
                                                <span className="font-bold text-gray-800">{entry.subject}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest border border-purple-100">
                                                {entry.class_name} - {entry.class_section}
                                            </span>
                                        </td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {timetable.length === 0 && (
                <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-800">No periods scheduled yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">Your timetable will appear here once the administrator assigns you to classes and subjects.</p>
                </div>
            )}
        </div>
    );
};

export default TeacherTimetable;
