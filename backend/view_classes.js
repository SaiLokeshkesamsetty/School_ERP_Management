const db = require('./config/db');

async function viewClasses() {
    try {
        const [classes] = await db.promise().query('SELECT * FROM classes');
        console.table(classes);
        process.exit();
    } catch (error) {
        console.error('Error fetching classes:', error);
        process.exit(1);
    }
}

viewClasses();
