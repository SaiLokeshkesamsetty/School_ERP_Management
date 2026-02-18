const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

async function createAdmin() {
    console.log('Connecting to database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'school_erp'
        });

        const username = 'admin';
        const password = '2005'; // The requested password
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = 'admin';

        // Check if user exists
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            console.log('Admin user already exists. Updating password...');
            await connection.execute('UPDATE users SET password = ?, role = ? WHERE username = ?', [hashedPassword, role, username]);
            console.log('Admin password updated successfully.');
        } else {
            console.log('Creating admin user...');
            await connection.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
            console.log('Admin user created successfully.');
        }

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        if (connection) await connection.end();
    }
}

createAdmin();
