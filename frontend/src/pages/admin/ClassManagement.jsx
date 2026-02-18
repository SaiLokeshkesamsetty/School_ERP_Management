
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Plus,
    Search,
    Calendar,
    X,
    Trash2,
    ChevronRight,
    Clock,
    User,
    BookOpen
} from 'lucide-react';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showTimetableModal, setShowTimetableModal] = useState(false);
    const [timetable, setTimetable] = useState([]);
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [newEntry, setNewEntry] = useState({
        day: 'Monday',
        start_time: '',
        end_time: '',
        subject: '',
        teacher_id: ''
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classRes, teacherRes] = await Promise.all([
                api.get('/classes'),
                api.get('/teachers')
            ]);
            setClasses(classRes.data);
            setTeachers(teacherRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleViewTimetable = async (cls) => {
        setSelectedClass(cls);
        setShowTimetableModal(true);
        try {
            const response = await api.get(`/classes/${cls.id}/timetable`);
            setTimetable(response.data);
        } catch (error) {
            console.error('Error fetching timetable:', error);
        }
    };

    const handleAddEntry = async (e) => {
        e.preventDefault();
        try {
            await api.post('/classes/timetable', {
                ...newEntry,
                class_id: selectedClass.id
            });
            setShowAddEntry(false);
            setNewEntry({
                day: 'Monday',
                start_time: '',
                end_time: '',
                subject: '',
                teacher_id: ''
            });
            // Refresh timetable
            const response = await api.get(`/classes/${selectedClass.id}/timetable`);
            setTimetable(response.data);
        } catch (error) {
            console.error('Error adding timetable entry:', error);
            alert('Failed to add entry. Please check your inputs.');
        }
    };

    const handleDeleteEntry = async (entryId) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;
        try {
            await api.delete(`/classes/timetable/${entryId}`);
            setTimetable(timetable.filter(t => t.id !== entryId));
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.section.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Class & Timetable Management</h1>
                    <p className="text-gray-500 mt-1">Manage weekly schedules for all classes</p>
                </div>
            </div>

            {/* Stats Cards (Optional but looks good) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Classes</p>
                        <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                    </div>
                </div>
            </div>

            {/* Class List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search class or section..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Class Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Section</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredClasses.map((cls) => (
                                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-900">{cls.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                                            Section {cls.section}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleViewTimetable(cls)}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center inline-flex space-x-2"
                                        >
                                            <Calendar size={16} />
                                            <span>Manage Timetable</span>
                                            <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredClasses.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-400 italic">No classes found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Timetable Modal */}
            {showTimetableModal && selectedClass && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
                            <div>
                                <h2 className="text-xl font-bold">Timetable: {selectedClass.name} - {selectedClass.section}</h2>
                                <p className="text-blue-100 text-sm mt-1">Admin Dashboard / Schedule</p>
                            </div>
                            <button
                                onClick={() => { setShowTimetableModal(false); setShowAddEntry(false); }}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {/* Toolbar */}
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Weekly Schedule</h3>
                                <button
                                    onClick={() => setShowAddEntry(!showAddEntry)}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center space-x-2"
                                >
                                    <Plus size={16} />
                                    <span>{showAddEntry ? 'Cancel' : 'Add Period'}</span>
                                </button>
                            </div>

                            {/* Add Entry Form */}
                            {showAddEntry && (
                                <form onSubmit={handleAddEntry} className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Day</label>
                                        <select
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                            value={newEntry.day}
                                            onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value })}
                                            required
                                        >
                                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                            value={newEntry.start_time}
                                            onChange={(e) => setNewEntry({ ...newEntry, start_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Time</label>
                                        <input
                                            type="time"
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                            value={newEntry.end_time}
                                            onChange={(e) => setNewEntry({ ...newEntry, end_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Mathematics"
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                            value={newEntry.subject}
                                            onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teacher</label>
                                        <select
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                            value={newEntry.teacher_id}
                                            onChange={(e) => setNewEntry({ ...newEntry, teacher_id: e.target.value })}
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full p-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Save
                                    </button>
                                </form>
                            )}

                            {/* Timetable Table */}
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Day</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Teacher</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {days.map(day => {
                                            const dayEntries = timetable.filter(t => t.day === day);
                                            if (dayEntries.length === 0) {
                                                return (
                                                    <tr key={day}>
                                                        <td className="px-6 py-4 font-bold text-gray-900 bg-gray-50/30">{day}</td>
                                                        <td colSpan="4" className="px-6 py-4 text-xs text-gray-400 italic">No periods scheduled</td>
                                                    </tr>
                                                );
                                            }
                                            return dayEntries.map((entry, idx) => (
                                                <tr key={entry.id} className="hover:bg-blue-50/30 transition-colors">
                                                    {idx === 0 && (
                                                        <td rowSpan={dayEntries.length} className="px-6 py-4 font-bold text-gray-900 bg-gray-50/30 border-r border-gray-50 align-top">
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
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                            <User size={14} className="text-amber-500" />
                                                            <span>{entry.teacher_name || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteEntry(entry.id)}
                                                            className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ));
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
