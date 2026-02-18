
const db = require('../config/db');

// Mark attendance
exports.markAttendance = async (req, res) => {
    const { student_id, date, status, subject } = req.body;
    const userId = req.userId; // Provided by verifyToken middleware

    if (!student_id || !date || !status || !subject) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // 1. Get teacher profile ID
        const [teachers] = await db.promise().query('SELECT id FROM teachers WHERE user_id = ?', [userId]);
        if (teachers.length === 0) return res.status(404).json({ message: 'Teacher profile not found' });
        const teacherId = teachers[0].id;

        // 2. Check if attendance already exists for this student, date, teacher AND subject
        const [existing] = await db.promise().query(
            'SELECT id FROM attendance WHERE student_id = ? AND date = ? AND teacher_id = ? AND subject = ?',
            [student_id, date, teacherId, subject]
        );

        if (existing.length > 0) {
            // Update existing record
            await db.promise().query(
                'UPDATE attendance SET status = ? WHERE id = ?',
                [status, existing[0].id]
            );
            return res.json({ message: 'Attendance updated successfully' });
        }

        // 3. Insert new record
        const [result] = await db.promise().query(
            'INSERT INTO attendance (student_id, teacher_id, subject, date, status) VALUES (?, ?, ?, ?, ?)',
            [student_id, teacherId, subject, date, status]
        );
        res.status(201).json({ message: 'Attendance marked successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get attendance by student ID (Admin/Teacher view)
exports.getAttendanceByStudent = async (req, res) => {
    try {
        const query = `
            SELECT a.*, t.name as teacher_name 
            FROM attendance a 
            LEFT JOIN teachers t ON a.teacher_id = t.id 
            WHERE a.student_id = ? 
            ORDER BY a.date DESC
        `;
        const [attendance] = await db.promise().query(query, [req.params.studentId]);
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get attendance report (Admin view)
exports.getAttendanceReport = async (req, res) => {
    const { date, class_id } = req.query;
    let query = `
        SELECT a.*, s.name as student_name, s.roll_no, t.name as teacher_name 
        FROM attendance a 
        JOIN students s ON a.student_id = s.id 
        LEFT JOIN teachers t ON a.teacher_id = t.id
    `;
    const params = [];
    const conditions = [];

    if (date) {
        conditions.push('a.date = ?');
        params.push(date);
    }
    if (class_id) {
        conditions.push('s.class_id = ?');
        params.push(class_id);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.date DESC, s.roll_no ASC';

    try {
        const [attendance] = await db.promise().query(query, params);
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get authenticated user's attendance (Student OR Parent view)
exports.getMyAttendance = async (req, res) => {
    try {
        const userId = req.userId;
        const role = req.userRole;
        let studentId = null;

        if (role === 'student') {
            const [students] = await db.promise().query('SELECT id FROM students WHERE user_id = ?', [userId]);
            if (students.length === 0) return res.status(404).json({ message: 'Student profile not found' });
            studentId = students[0].id;
        } else if (role === 'parent') {
            const [parents] = await db.promise().query('SELECT student_id FROM parents WHERE user_id = ?', [userId]);
            if (parents.length === 0) return res.status(404).json({ message: 'Parent profile not found' });
            if (!parents[0].student_id) return res.status(400).json({ message: 'No student linked to this parent account' });
            studentId = parents[0].student_id;
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        const query = `
            SELECT a.*, t.name as teacher_name 
            FROM attendance a 
            LEFT JOIN teachers t ON a.teacher_id = t.id 
            WHERE a.student_id = ? 
            ORDER BY a.date DESC
        `;
        const [attendance] = await db.promise().query(query, [studentId]);
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
