
const db = require('../config/db');

// Create an exam
exports.createExam = async (req, res) => {
    const { name, start_date, end_date, class_id } = req.body;

    try {
        const [result] = await db.promise().query(
            'INSERT INTO exams (name, start_date, end_date, class_id) VALUES (?, ?, ?, ?)',
            [name, start_date, end_date, class_id]
        );
        res.status(201).json({ message: 'Exam created successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all exams
exports.getAllExams = async (req, res) => {
    try {
        const [exams] = await db.promise().query('SELECT * FROM exams');
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add result
exports.addResult = async (req, res) => {
    const { exam_id, student_id, subject, marks, grade } = req.body;

    try {
        const [result] = await db.promise().query(
            'INSERT INTO exam_results (exam_id, student_id, subject, marks, grade) VALUES (?, ?, ?, ?, ?)',
            [exam_id, student_id, subject, marks, grade]
        );
        res.status(201).json({ message: 'Result added successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get results by student
exports.getResultsByStudent = async (req, res) => {
    try {
        const [results] = await db.promise().query(
            'SELECT er.*, e.name as exam_name FROM exam_results er JOIN exams e ON er.exam_id = e.id WHERE er.student_id = ?',
            [req.params.studentId]
        );
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get authenticated student's results
exports.getMyResults = async (req, res) => {
    try {
        const userId = req.user.id;
        const [students] = await db.promise().query('SELECT id FROM students WHERE user_id = ?', [userId]);

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        const studentId = students[0].id;
        const [results] = await db.promise().query(
            'SELECT er.*, e.name as exam_name FROM exam_results er JOIN exams e ON er.exam_id = e.id WHERE er.student_id = ?',
            [studentId]
        );
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
