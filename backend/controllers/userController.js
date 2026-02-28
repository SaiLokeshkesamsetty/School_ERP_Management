const db = require('../config/db');

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
