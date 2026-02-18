import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Search, Edit, Trash2, X, User, Lock, Phone } from 'lucide-react';

const ParentManagement = () => {
    const [parents, setParents] = useState([]);
    const [students, setStudents] = useState([]); // For student selection dropdown
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        student_id: ''
    });

    useEffect(() => {
        fetchParents();
        fetchStudents();
    }, []);

    const fetchParents = async () => {
        try {
            const response = await api.get('/parents');
            setParents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching parents:', error);
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/parents', formData);
            setShowModal(false);
            fetchParents(); // Refresh list
            setFormData({
                username: '',
                password: '',
                name: '',
                phone: '',
                email: '',
                student_id: ''
            });
            alert('Parent added successfully!');
        } catch (error) {
            console.error('Error adding parent:', error);
            alert('Failed to add parent: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this parent? This will also delete their login account.')) {
            try {
                await api.delete(`/parents/${id}`);
                fetchParents();
            } catch (error) {
                console.error('Error deleting parent:', error);
            }
        }
    };

    const filteredParents = parents.filter(parent =>
        parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Parent Management</h1>
                    <p className="text-gray-500 mt-1">Manage parent profiles and student links</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-sm"
                >
                    <Plus size={20} className="mr-2" /> Add New Parent
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
                <Search size={20} className="text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search by name, username or student name..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Parents Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="p-5">Name & Username</th>
                                <th className="p-5">Linked Student</th>
                                <th className="p-5">Contact</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading parents...</td></tr>
                            ) : filteredParents.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No parents found.</td></tr>
                            ) : (
                                filteredParents.map(parent => (
                                    <tr key={parent.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                                                    {parent.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800">{parent.name}</div>
                                                    <div className="text-sm text-gray-500">@{parent.username || 'unknown'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {parent.student_name ? (
                                                <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-semibold">
                                                    {parent.student_name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not Linked</span>
                                            )}
                                        </td>
                                        <td className="p-5 text-sm">
                                            <div className="text-gray-900">{parent.phone}</div>
                                            <div className="text-gray-500">{parent.email}</div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(parent.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Parent Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Add New Parent</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Student</label>
                                        <select
                                            name="student_id"
                                            value={formData.student_id}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Select a student...</option>
                                            {students.map(student => (
                                                <option key={student.id} value={student.id}>{student.name} (Roll: {student.roll_no})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
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
                                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-all transform active:scale-95"
                                >
                                    Create Parent
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParentManagement;
