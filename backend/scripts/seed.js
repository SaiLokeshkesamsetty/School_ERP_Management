
const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        const password = await bcrypt.hash('admin123', 10);

        // Check if admin already exists
        const [users] = await db.promise().query('SELECT * FROM users WHERE username = ?', ['admin']);
        if (users.length > 0) {
            console.log('Admin user already exists');
            process.exit();
        }

        await db.promise().query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            ['admin', password, 'admin']
        );
        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedDatabase();
