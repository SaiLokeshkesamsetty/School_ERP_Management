
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Announcements = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({ title: '', message: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await api.get('/communications/announcements');
            setAnnouncements(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch announcements', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/communications/announcements', formData);
            fetchAnnouncements();
            setFormData({ title: '', message: '' });
            alert('Announcement posted successfully');
        } catch (error) {
            alert('Failed to post announcement');
        }
    };

    if (loading) return <div>Loading announcements...</div>;

    const canPost = user.role === 'admin' || user.role === 'teacher';

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Announcements</h2>

            {canPost && (
                <div className="bg-white p-6 rounded shadow-md mb-8">
                    <h3 className="text-xl font-bold mb-4">Post Announcement</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="border rounded p-2 w-full" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1">Message</label>
                            <textarea name="message" value={formData.message} onChange={handleChange} className="border rounded p-2 w-full" rows="3" required></textarea>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Post</button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {announcements.map(announcement => (
                    <div key={announcement.id} className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                        <h3 className="text-xl font-bold">{announcement.title}</h3>
                        <p className="text-gray-600 mb-2">{new Date(announcement.created_at).toLocaleDateString()}</p>
                        <p className="text-gray-800">{announcement.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
