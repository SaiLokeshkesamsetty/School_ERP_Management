const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

async function create() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'school_erp'
        });

        const query = `
            CREATE TABLE IF NOT EXISTS timetables (
                id INT AUTO_INCREMENT PRIMARY KEY,
                class_id INT NOT NULL,
                day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                subject VARCHAR(255) NOT NULL,
                teacher_id INT,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await db.query(query);
        console.log("Table 'timetables' created or already exists.");
        await db.end();
    } catch (err) {
        console.error('Error creating table:', err);
    }
}

create();
