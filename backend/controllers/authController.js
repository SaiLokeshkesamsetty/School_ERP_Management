
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, role, ...otherDetails } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        const [existingUser] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
        const userId = userResult.insertId;

        if (role === 'student') {
            const { name, class_id, roll_no, parent_phone } = otherDetails;
            // Ideally we should link parent here too if exists, but for now let's just create the student record
            // If parent_phone is provided, we could try to find the parent, but let's keep it simple: just create student profile
            await connection.query('INSERT INTO students (user_id, name, class_id, roll_no) VALUES (?, ?, ?, ?)', [userId, name || username, class_id || null, roll_no || null]);
        } else if (role === 'teacher') {
            const { name, subject_specialization, phone } = otherDetails;
            await connection.query('INSERT INTO teachers (user_id, name, subject_specialization, phone) VALUES (?, ?, ?, ?)', [userId, name || username, subject_specialization || null, phone || null]);
        } else if (role === 'parent') {
            const { name, phone, student_id } = otherDetails;
            await connection.query('INSERT INTO parents (user_id, name, phone, student_id) VALUES (?, ?, ?, ?)', [userId, name || username, phone || null, student_id || null]);
        }

        await connection.commit();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT id, username, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update user
exports.updateUser = async (req, res) => {
    const { username, role } = req.body;
    try {
        await db.promise().query('UPDATE users SET username = ?, role = ? WHERE id = ?', [username, role, req.params.id]);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
    try {
        await db.promise().query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
