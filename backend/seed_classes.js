const db = require('./config/db');

async function seedClasses() {
    try {
        const classes = [
            { name: 'Class 5', section: 'A' },
            { name: 'Class 6', section: 'A' },
            { name: 'Class 7', section: 'A' },
            { name: 'Class 8', section: 'A' },
            { name: 'Class 9', section: 'A' },
            { name: 'Class 10', section: 'A' },
        ];

        for (const cls of classes) {
            await db.promise().query('INSERT INTO classes (name, section) VALUES (?, ?)', [cls.name, cls.section]);
        }

        console.log('Classes 5-10 seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding classes:', error);
        process.exit(1);
    }
}

seedClasses();
