const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'school_erp'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database.');

    const query = 'SELECT COUNT(*) as count FROM students';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying students:', err);
        } else {
            console.log('Total Students in DB:', results[0].count);
        }

        const listQuery = 'SELECT * FROM students LIMIT 5';
        db.query(listQuery, (err, rows) => {
            if (err) {
                console.error('Error listing students:', err);
            } else {
                console.log('Sample Students:', rows);
            }
            db.end();
        });
    });
});
