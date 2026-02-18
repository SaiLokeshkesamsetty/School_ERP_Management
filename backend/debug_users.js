const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'school_erp'
});

db.connect((err) => {
    if (err) throw err;
    const query = 'SELECT * FROM users WHERE role = "teacher" LIMIT 1';
    db.query(query, (err, results) => {
        if (err) console.error(err);
        else console.log('Teacher User:', results);
        db.end();
    });
});
