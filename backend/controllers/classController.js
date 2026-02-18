const db = require('../config/db');

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const [classes] = await db.promise().query('SELECT * FROM classes');
        res.json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get timetable for a class
exports.getTimetableByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const query = `
            SELECT t.*, tc.name as teacher_name 
            FROM timetables t
            LEFT JOIN teachers tc ON t.teacher_id = tc.id
            WHERE t.class_id = ?
            ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time
        `;
        const [timetable] = await db.promise().query(query, [classId]);
        res.json(timetable);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add timetable entry
exports.addTimetableEntry = async (req, res) => {
    try {
        const { class_id, day, start_time, end_time, subject, teacher_id } = req.body;

        // Basic validation
        if (!class_id || !day || !start_time || !end_time || !subject) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const query = 'INSERT INTO timetables (class_id, day, start_time, end_time, subject, teacher_id) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [class_id, day, start_time, end_time, subject, teacher_id]);

        res.status(201).json({ message: 'Timetable entry added successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete timetable entry
exports.deleteTimetableEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        await db.promise().query('DELETE FROM timetables WHERE id = ?', [entryId]);
        res.json({ message: 'Timetable entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
