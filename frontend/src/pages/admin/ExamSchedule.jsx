
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ExamSchedule = () => {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        class_id: ''
    });

    useEffect(() => {
        fetchExams();
        fetchClasses();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await api.get('/exams');
            setExams(response.data);
        } catch (error) {
            console.error('Failed to fetch exams', error);
        }
    };

    const fetchClasses = async () => {
        // Mock classes or fetch from API if exists
        // Assuming we have a classes endpoint or hardcode for now
        // setClasses([{id: 1, name: 'Class 1'}, {id: 2, name: 'Class 2'}]);
        // For now, let's just use text input for class_id or fetch if possible. 
        // Let's assume we don't have a classes endpoint yet, so we'll just ask for Class ID.
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/exams', formData);
            fetchExams();
            setFormData({ name: '', start_date: '', end_date: '', class_id: '' });
            alert('Exam scheduled successfully');
        } catch (error) {
            alert('Failed to schedule exam');
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Exam Schedule</h2>

            <div className="bg-white p-6 rounded shadow-md mb-8">
                <h3 className="text-xl font-bold mb-4">Schedule New Exam</h3>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
                    <div>
                        <label className="block text-sm font-bold mb-1">Exam Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Start Date</label>
                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="border rounded p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">End Date</label>
                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="border rounded p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Class ID</label>
                        <input type="number" name="class_id" value={formData.class_id} onChange={handleChange} className="border rounded p-2" required />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Schedule</button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exam Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map(exam => (
                            <tr key={exam.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{exam.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(exam.start_date).toLocaleDateString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(exam.end_date).toLocaleDateString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{exam.class_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExamSchedule;
