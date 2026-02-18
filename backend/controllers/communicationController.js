
const db = require('../config/db');

// Send a message
exports.sendMessage = async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;

    try {
        await db.promise().query(
            'INSERT INTO communications (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [sender_id, receiver_id, message]
        );
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get messages for a user
exports.getMessages = async (req, res) => {
    try {
        const [messages] = await db.promise().query(
            'SELECT * FROM communications WHERE receiver_id = ? OR sender_id = ? ORDER BY sent_at DESC',
            [req.params.userId, req.params.userId]
        );
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Announcement (stored as message with null receiver or specific flag, here simplified)
exports.createAnnouncement = async (req, res) => {
    const { sender_id, message } = req.body;
    // Assuming receiver_id null implies public announcement for this simple implementation
    // Or we could have a separate announcements table as per requirements, let's use a separate table approach if we rigidly followed schemas,
    // but the schema file had 'communications'. Let's stick to communications for now or create a simple table on the fly if needed.
    // The previous schema had 'communications' for messages. Let's assume announcements are just messages to all (or logic handled in frontend).
    // For a proper implementation, let's add an 'announcements' table or treat it here.
    // Let's go with the schema we created: 'communications' was the only one.
    // I'll stick to 1:1 format for now as per "Teacher <-> Parent messaging".

    // If requirement says "Announcements", let's make a simple endpoint that just inserts with receiver_id = 0 or similar convention, 
    // or arguably we update schema. But to avoid schema changes now, let's just use communications.

    try {
        await db.promise().query(
            'INSERT INTO communications (sender_id, receiver_id, message) VALUES (?, 0, ?)',
            [sender_id, message]
        );
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAnnouncements = async (req, res) => {
    try {
        const [announcements] = await db.promise().query(
            'SELECT * FROM communications WHERE receiver_id = 0 ORDER BY sent_at DESC'
        );
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
