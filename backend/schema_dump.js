const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

async function dump() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'school_erp'
        });

        const [tables] = await db.query('SHOW TABLES');
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            console.log('\n--- ' + tableName + ' ---');
            const [cols] = await db.query('DESCRIBE ' + tableName);
            console.table(cols.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null, Key: c.Key, Default: c.Default, Extra: c.Extra })));
        }
        await db.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

dump();
