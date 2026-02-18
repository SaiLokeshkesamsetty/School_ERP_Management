const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all parents
exports.getAllParents = async (req, res) => {
    try {
        const [parents] = await db.promise().query(`
            SELECT p.*, u.username, s.name as student_name 
            FROM parents p 
            LEFT JOIN users u ON p.user_id = u.id 
            LEFT JOIN students s ON p.student_id = s.id
        `);
        res.json(parents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new parent (Create User + Parent Profile)
exports.addParent = async (req, res) => {
    const { username, password, name, phone, email, student_id } = req.body;

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
        const [userResult] = await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'parent']);
        const userId = userResult.insertId;

        // 3. Create Parent Profile
        await connection.query(
            'INSERT INTO parents (user_id, name, phone, email, student_id) VALUES (?, ?, ?, ?, ?)',
            [userId, name, phone || null, email || null, student_id || null]
        );

        await connection.commit();
        res.status(201).json({ message: 'Parent created successfully', id: userId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

// Update parent
exports.updateParent = async (req, res) => {
    const { name, phone, email, student_id } = req.body;

    try {
        await db.promise().query(
            'UPDATE parents SET name = ?, phone = ?, email = ?, student_id = ? WHERE id = ?',
            [name, phone, email, student_id || null, req.params.id]
        );
        res.json({ message: 'Parent updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete parent (Delete User + Profile)
exports.deleteParent = async (req, res) => {
    const connection = await db.promise().getConnection();
    try {
        await connection.beginTransaction();

        // Get user_id first
        const [parent] = await connection.query('SELECT user_id FROM parents WHERE id = ?', [req.params.id]);

        if (parent.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Parent not found' });
        }

        const userId = parent[0].user_id;

        // Delete from parents first
        await connection.query('DELETE FROM parents WHERE id = ?', [req.params.id]);

        if (userId) {
            await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        }

        await connection.commit();
        res.json({ message: 'Parent and associated user account deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};
