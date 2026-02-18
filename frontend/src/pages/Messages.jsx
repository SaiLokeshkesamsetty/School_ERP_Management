
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
        fetchUsers();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/communications/messages');
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch messages', error);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        // Fetch potential recipients based on role
        // Teacher -> Parents/Students? 
        // Parent -> Teachers?
        // For now, let's just fetch all users for simplicity or use the /auth/users admin endpoint if accessible
        // Or better, add a specific endpoint to get recipients.
        // Let's assume we can chat with anyone for now or list all users.
        try {
            const response = await api.get('/auth/users'); // This might differ for non-admins
            // If not admin, this might fail unless we open it up or create a specific endpoint
            setUsers(response.data);
        } catch (error) {
            // Fallback or handle error
            console.error('Failed to fetch users', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!selectedUser || !messageText) return;

        try {
            await api.post('/communications/messages', {
                receiver_id: selectedUser,
                message: messageText
            });
            setMessageText('');
            fetchMessages();
            alert('Message sent');
        } catch (error) {
            alert('Failed to send message');
        }
    };

    if (loading) return <div>Loading messages...</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Messages</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Send Message Form */}
                <div className="bg-white p-6 rounded shadow-md">
                    <h3 className="text-xl font-bold mb-4">Send Message</h3>
                    <form onSubmit={handleSendMessage}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1">To:</label>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="border rounded p-2 w-full"
                                required
                            >
                                <option value="">Select Recipient</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1">Message</label>
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="border rounded p-2 w-full"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Send</button>
                    </form>
                </div>

                {/* Inbox */}
                <div className="bg-gray-50 p-6 rounded shadow-inner h-96 overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4">Inbox / Sent</h3>
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`p-4 rounded shadow ${msg.sender_id === user.id ? 'bg-blue-100 ml-8' : 'bg-white mr-8'}`}>
                                <div className="text-xs text-gray-500 mb-1">
                                    {msg.sender_id === user.id ? 'You' : `User ${msg.sender_id}`} to {msg.receiver_id === user.id ? 'You' : `User ${msg.receiver_id}`}
                                    <span className="float-right">{new Date(msg.created_at).toLocaleString()}</span>
                                </div>
                                <p>{msg.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
