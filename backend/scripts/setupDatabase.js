
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sqlFile = path.join(__dirname, '../database.sql');

async function setupDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true // Essential for executing the entire file at once
        });

        console.log('Connected to MySQL server.');

        const sql = fs.readFileSync(sqlFile, 'utf8');
        await connection.query(sql);

        console.log('Database schema executed successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();
