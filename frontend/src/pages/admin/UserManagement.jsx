
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/auth/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Username
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user.username}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${user.role === 'admin' ? 'bg-red-200 text-red-900' :
                                            user.role === 'teacher' ? 'bg-green-200 text-green-900' :
                                                'bg-blue-200 text-blue-900'
                                        }`}>
                                        <span aria-hidden="true" className="absolute inset-0 opacity-50 rounded-full"></span>
                                        <span className="relative">{user.role}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{new Date(user.created_at).toLocaleDateString()}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
