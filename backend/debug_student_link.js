const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

async function debug() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'school_erp'
    });

    console.log('--- Students ---');
    const [students] = await db.query('SELECT s.id, s.name, s.user_id, u.username FROM students s LEFT JOIN users u ON s.user_id = u.id');
    console.table(students);

    console.log('--- Users ---');
    const [users] = await db.query('SELECT id, username, role FROM users');
    console.table(users);

    console.log('--- Attendance ---');
    const [attendance] = await db.query('SELECT * FROM attendance');
    console.table(attendance);

    await db.end();
}

debug();
