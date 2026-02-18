
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const MarksEntry = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await api.get('/exams');
            setExams(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch exams', error);
            setLoading(false);
        }
    };

    const fetchStudentsForExam = async (examId) => {
        // ideally fetch students of the class associated with the exam
        // For now, let's fetch all students
        try {
            const response = await api.get('/students');
            setStudents(response.data);
            // Initialize marks
            const initialMarks = {};
            response.data.forEach(student => {
                initialMarks[student.id] = '';
            });
            setMarks(initialMarks);
        } catch (error) {
            console.error('Failed to fetch students', error);
        }
    };

    const handleExamChange = (e) => {
        const examId = e.target.value;
        setSelectedExam(examId);
        if (examId) {
            fetchStudentsForExam(examId);
        } else {
            setStudents([]);
        }
    };

    const handleMarkChange = (studentId, value) => {
        setMarks({ ...marks, [studentId]: value });
    };

    const handleSubmit = async () => {
        try {
            const promises = Object.keys(marks).map(studentId => {
                if (marks[studentId] === '') return null;
                return api.post('/exams/results', {
                    exam_id: selectedExam,
                    student_id: studentId,
                    marks: marks[studentId],
                    subject: 'General' // Placeholder, should be dynamic
                });
            });
            await Promise.all(promises);
            alert('Marks submitted successfully');
        } catch (error) {
            console.error('Failed to submit marks', error);
            alert('Failed to submit marks');
        }
    };

    if (loading) return <div>Loading exams...</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Enter Marks</h2>
            <div className="mb-6">
                <label className="mr-2 font-bold">Select Exam:</label>
                <select
                    value={selectedExam}
                    onChange={handleExamChange}
                    className="border rounded px-2 py-1"
                >
                    <option value="">Select an Exam</option>
                    {exams.map(exam => (
                        <option key={exam.id} value={exam.id}>{exam.name} ({new Date(exam.date).toLocaleDateString()})</option>
                    ))}
                </select>
            </div>

            {selectedExam && (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Roll No</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{student.name}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{student.roll_no}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <input
                                                type="number"
                                                value={marks[student.id]}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                className="border rounded px-2 py-1 w-24"
                                                placeholder="Marks"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Submit Marks
                    </button>
                </>
            )}
        </div>
    );
};

export default MarksEntry;
