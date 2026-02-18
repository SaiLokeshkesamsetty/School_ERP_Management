
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const [teachers] = await db.promise().query(`
            SELECT t.*, u.username 
            FROM teachers t 
            LEFT JOIN users u ON t.user_id = u.id
        `);
        res.json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new teacher (Create User + Teacher Profile)
exports.addTeacher = async (req, res) => {
    const { username, password, name, subject_specialization, phone, email } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ message: 'Username, password, and name are required' });
    }

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        // 1. Check if username exists
        const [existingUser] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Username already exists' });
        }

        // 2. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'teacher']);
        const userId = userResult.insertId;

        // 3. Create Teacher Profile
        await connection.query(
            'INSERT INTO teachers (user_id, name, subject_specialization, phone, email) VALUES (?, ?, ?, ?, ?)',
            [userId, name, subject_specialization || null, phone || null, email || null]
        );

        await connection.commit();
        res.status(201).json({ message: 'Teacher created successfully', id: userId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
    const { name, subject_specialization, phone, email } = req.body;

    try {
        await db.promise().query(
            'UPDATE teachers SET name = ?, subject_specialization = ?, phone = ?, email = ? WHERE id = ?',
            [name, subject_specialization, phone, email, req.params.id]
        );
        res.json({ message: 'Teacher updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete teacher (Delete User + Profile)
exports.deleteTeacher = async (req, res) => {
    const connection = await db.promise().getConnection();
    try {
        await connection.beginTransaction();

        // Get user_id first
        const [teacher] = await connection.query('SELECT user_id FROM teachers WHERE id = ?', [req.params.id]);

        if (teacher.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const userId = teacher[0].user_id;

        // Delete form teachers first
        await connection.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);

        if (userId) {
            await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        }

        await connection.commit();
        res.json({ message: 'Teacher and associated user account deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

// Get authenticated teacher's timetable
exports.getMyTimetable = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Get teacher profile ID
        const [teachers] = await db.promise().query('SELECT id FROM teachers WHERE user_id = ?', [userId]);
        if (teachers.length === 0) return res.status(404).json({ message: 'Teacher profile not found' });
        const teacherId = teachers[0].id;

        // 2. Fetch timetable entries
        const query = `
            SELECT t.*, c.name as class_name, c.section as class_section
            FROM timetables t
            JOIN classes c ON t.class_id = c.id
            WHERE t.teacher_id = ?
            ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time
        `;
        const [timetable] = await db.promise().query(query, [teacherId]);
        res.json(timetable);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
