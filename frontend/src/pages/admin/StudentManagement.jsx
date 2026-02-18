import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Edit, Trash2, X, Lock, User, Calendar } from 'lucide-react';

const StudentManagement = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentAttendance, setStudentAttendance] = useState([]);
    const [classes, setClasses] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        class_id: '',
        roll_no: '',
        gender: 'Male',
        address: ''
    });

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');
            setStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/students', formData);
            setShowModal(false);
            fetchStudents(); // Refresh list
            // Reset form
            setFormData({
                username: '',
                password: '',
                name: '',
                class_id: '',
                roll_no: '',
                gender: 'Male',
                address: ''
            });
            alert('Student added successfully!');
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student? This will also delete their login account.')) {
            try {
                await api.delete(`/students/${id}`);
                fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    };

    const handleViewAttendance = async (student) => {
        setSelectedStudent(student);
        setShowAttendanceModal(true);
        try {
            const response = await api.get(`/attendance/student/${student.id}`);
            setStudentAttendance(response.data);
        } catch (error) {
            console.error('Error fetching student attendance:', error);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
                    <p className="text-gray-500 mt-1">Manage student profiles and accounts</p>
                </div>
                {user?.role === 'admin' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-sm"
                    >
                        <Plus size={20} className="mr-2" /> Add New Student
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
                <Search size={20} className="text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search by name, username or roll no..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="p-5">Name & Username</th>
                                <th className="p-5">Roll No</th>
                                <th className="p-5">Class</th>
                                <th className="p-5">Gender</th>
                                {user?.role === 'admin' && <th className="p-5 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading students...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No students found.</td></tr>
                            ) : (
                                filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800">{student.name}</div>
                                                    <div className="text-sm text-gray-500">@{student.username || 'unknown'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-gray-600">{student.roll_no || '-'}</td>
                                        <td className="p-5">
                                            <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-semibold">
                                                {student.class_name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-gray-600 capitalize">{student.gender || '-'}</td>
                                        {user?.role === 'admin' && (
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleViewAttendance(student)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="View Attendance"
                                                    >
                                                        <Calendar size={18} />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(student.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Student Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Account Details Section */}
                            <div className="bg-blue-50 p-4 rounded-xl space-y-4">
                                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide flex items-center">
                                    <Lock size={16} className="mr-2" /> Login Credentials
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Personal Details Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center">
                                    <User size={16} className="mr-2" /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                        <select
                                            name="class_id"
                                            value={formData.class_id}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} {cls.section ? `(${cls.section})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                                        <input
                                            type="text"
                                            name="roll_no"
                                            value={formData.roll_no}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md transition-all transform active:scale-95"
                                >
                                    Create Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Attendance Modal */}
            {showAttendanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Attendance History</h2>
                                <p className="text-sm text-gray-500">{selectedStudent?.name}</p>
                            </div>
                            <button onClick={() => setShowAttendanceModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {studentAttendance.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No attendance records found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {studentAttendance.map((record) => (
                                        <div key={record.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-black text-gray-900">
                                                    {new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                                                    record.status === 'Absent' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 gap-3">
                                                <div className="flex items-center">
                                                    <BookOpen size={14} className="mr-1 text-blue-500" />
                                                    <span className="font-bold text-gray-700">{record.subject || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <User size={14} className="mr-1 text-gray-400" />
                                                    <span>{record.teacher_name || 'System'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setShowAttendanceModal(false)}
                                className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
