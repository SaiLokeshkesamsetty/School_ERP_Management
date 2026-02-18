
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ResultView = () => {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            // Similar logic to AttendanceView for getting student ID
            // We need a way to get 'my results' or resolve student ID

            // For now, let's assume the user object in context context has student_id if it's a student
            // OR we use the same getMyAttendance logic but for results. 
            // Better yet, let's add `getMyResults` to examController.

            // Assuming we added /exams/my-results endpoint (Need to implement it)
            const response = await api.get('/exams/my-results');
            setResults(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch results', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading results...</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">My Exam Results</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exam</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marks</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{result.exam_name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{result.subject}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{result.marks}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{result.grade || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultView;
