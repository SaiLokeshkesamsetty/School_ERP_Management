const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
    try {
        console.log('Connecting to DB...');
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'school_erp'
        });
        console.log('Connected.');
        const [rows] = await conn.execute('SELECT id, username, role, password FROM users WHERE username = ?', ['admin']);
        console.log('User found:', rows);
        await conn.end();
    } catch (e) {
        console.error('Error:', e);
    }
}
check();
