const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const [students] = await db.promise().query(`
            SELECT s.*, u.username, c.name as class_name 
            FROM students s 
            LEFT JOIN users u ON s.user_id = u.id 
            LEFT JOIN classes c ON s.class_id = c.id
        `);
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const [student] = await db.promise().query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (student.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new student (Create User + Student Profile)
exports.addStudent = async (req, res) => {
    const { username, password, name, class_id, roll_no, dob, gender, address, phone, email } = req.body;

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
        const [userResult] = await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'student']);
        const userId = userResult.insertId;

        // 3. Create Student Profile
        await connection.query(
            'INSERT INTO students (user_id, name, class_id, roll_no, dob, gender, address, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, name, class_id || null, roll_no, dob || null, gender || null, address || null, phone || null, email || null]
        );

        await connection.commit();
        res.status(201).json({ message: 'Student created successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    const { name, class_id, roll_no, dob, gender, address, phone, email } = req.body;

    try {
        await db.promise().query(
            'UPDATE students SET name = ?, class_id = ?, roll_no = ?, dob = ?, gender = ?, address = ?, phone = ?, email = ? WHERE id = ?',
            [name, class_id, roll_no, dob, gender, address, phone, email, req.params.id]
        );
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete student (Delete User + Profile)
exports.deleteStudent = async (req, res) => {
    const connection = await db.promise().getConnection();
    try {
        await connection.beginTransaction();

        // Get user_id first
        const [student] = await connection.query('SELECT user_id FROM students WHERE id = ?', [req.params.id]);

        if (student.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Student not found' });
        }

        const userId = student[0].user_id;

        // Delete from students table first (to allow user deletion if constraints exist, though foreign key is usually other way around or ON DELETE CASCADE)
        await connection.query('DELETE FROM students WHERE id = ?', [req.params.id]);

        if (userId) {
            await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        }

        await connection.commit();
        res.json({ message: 'Student and associated user account deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

// Get authenticated student's timetable
exports.getMyTimetable = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Get student profile and class_id
        const [students] = await db.promise().query('SELECT class_id FROM students WHERE user_id = ?', [userId]);
        if (students.length === 0) return res.status(404).json({ message: 'Student profile not found' });
        const classId = students[0].class_id;

        if (!classId) return res.status(200).json([]); // Return empty if no class assigned

        // 2. Fetch timetable entries for that class
        const query = `
            SELECT t.*, tc.name as teacher_name 
            FROM timetables t
            LEFT JOIN teachers tc ON t.teacher_id = tc.id
            WHERE t.class_id = ?
            ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time
        `;
        const [timetable] = await db.promise().query(query, [classId]);
        res.json(timetable);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
