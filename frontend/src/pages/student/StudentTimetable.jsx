
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Calendar,
    Clock,
    Info,
    Coffee
} from 'lucide-react';

const StudentTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const response = await api.get('/students/my-timetable');
            setTimetable(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching timetable:', error);
            setLoading(false);
        }
    };

    // Helper to format 24h to 12h AM/PM
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    // Extract unique time slots and sort them
    const getTimeSlots = () => {
        const slots = [];
        const seen = new Set();

        timetable.forEach(entry => {
            const slotKey = `${entry.start_time}-${entry.end_time}`;
            if (!seen.has(slotKey)) {
                slots.push({ start: entry.start_time, end: entry.end_time });
                seen.add(slotKey);
            }
        });

        // Sort by start time
        slots.sort((a, b) => a.start.localeCompare(b.start));

        // Inject Lunch Break if not present (usually 12:00 - 13:00)
        const hasLunch = slots.some(s => s.start.startsWith('12:00'));
        if (!hasLunch) {
            // Find insertion point for lunch
            const lunchIndex = slots.findIndex(s => s.start >= '12:00');
            const lunchSlot = { start: '12:00:00', end: '13:00:00', isLunch: true };
            if (lunchIndex === -1) {
                slots.push(lunchSlot);
            } else {
                slots.splice(lunchIndex, 0, lunchSlot);
            }
        }

        return slots;
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const slots = getTimeSlots();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Weekly Class Schedule</h1>
                    <p className="text-gray-500 mt-1">Manage your time effectively with your class grid</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center space-x-2">
                    <Calendar size={18} />
                    <span>Academic Year 2025-26</span>
                </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white border-r border-gray-100 w-40">Time</th>
                                {days.map(day => (
                                    <th key={day} className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {slots.map((slot, idx) => (
                                <tr key={idx} className={slot.isLunch ? "bg-gray-50/50" : "hover:bg-blue-50/10 transition-colors"}>
                                    <td className="px-6 py-6 font-bold text-gray-600 bg-white border-r border-gray-100 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <Clock size={14} className="text-blue-500" />
                                            <span className="text-xs">{formatTime(slot.start)} - {formatTime(slot.end)}</span>
                                        </div>
                                    </td>
                                    {days.map(day => {
                                        const entry = timetable.find(e => e.day === day && e.start_time === slot.start);

                                        if (slot.isLunch) {
                                            return (
                                                <td key={day} className="px-4 py-4 text-center">
                                                    <div className="flex flex-col items-center justify-center opacity-40">
                                                        <Coffee size={16} className="text-gray-400 mb-1" />
                                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">Lunch</span>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        return (
                                            <td key={day} className="px-4 py-4 border-l border-gray-50/50">
                                                {entry ? (
                                                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
                                                        <div className="text-sm font-black text-blue-900 leading-tight">
                                                            {entry.subject}
                                                        </div>
                                                        <div className="text-[10px] font-medium text-blue-600/70 flex items-center">
                                                            <div className="w-1 h-1 bg-blue-400 rounded-full mr-1.5"></div>
                                                            {entry.teacher_name || 'TBA'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center">
                                                        <div className="w-4 h-0.5 bg-gray-200 rounded-full"></div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {timetable.length === 0 && (
                <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-800">No classes scheduled yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">Your class timetable will appear here once it is published by the administration.</p>
                </div>
            )}
        </div>
    );
};

export default StudentTimetable;
