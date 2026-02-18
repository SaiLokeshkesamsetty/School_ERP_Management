const db = require('../config/db');

exports.getTeacherDashboardStats = async (req, res) => {
    try {
        // 1. Total Students
        const [students] = await db.promise().query('SELECT COUNT(*) as count FROM students');

        // 2. Total Classes
        const [classes] = await db.promise().query('SELECT COUNT(*) as count FROM classes');

        // 3. Attendance Today (Mocked logic for now as we need today's attendance specifically)
        // In a real scenario, we'd query the attendance table for today's date
        const [attendance] = await db.promise().query('SELECT COUNT(*) as total, COUNT(CASE WHEN status = "Present" THEN 1 END) as present FROM attendance WHERE date = CURDATE()');
        const attendancePercentage = attendance[0].total > 0 ? Math.round((attendance[0].present / attendance[0].total) * 100) : 0;

        // 4. Recent Activity (Mock - or fetch from a logs table if it existed)
        const recentActivity = [
            { id: 1, text: 'New student added to Class 5A', time: '2 hours ago' },
            { id: 2, text: 'Attendance marked for Class 6B', time: '4 hours ago' },
            { id: 3, text: 'Exam schedule updated', time: '1 day ago' }
        ];

        // 5. Announcements (Fetch typical announcements)
        const announcements = [
            { id: 1, title: 'Staff Meeting', type: 'Academic', time: 'Today', content: 'Mandatory staff meeting today at 2:00 PM.' },
            { id: 2, title: 'Exam Schedule', type: 'Exam', time: 'Yesterday', content: 'Final exam schedule has been released.' }
        ];

        res.json({
            stats: {
                students: students[0].count,
                classes: classes[0].count,
                attendance: attendancePercentage,
                pendingMarks: 5 // Mock for now
            },
            recentActivity,
            announcements,
            charts: {
                attendance: [
                    { name: 'Mon', attendance: 90 },
                    { name: 'Tue', attendance: 85 },
                    { name: 'Wed', attendance: 92 },
                    { name: 'Thu', attendance: 88 },
                    { name: 'Fri', attendance: 95 }
                ],
                classPerformance: [
                    { name: 'Class 5', score: 82 },
                    { name: 'Class 6', score: 78 },
                    { name: 'Class 7', score: 85 },
                    { name: 'Class 8', score: 90 },
                    { name: 'Class 9', score: 88 }
                ]
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

exports.getStudentDashboardStats = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Get student ID
        const [students] = await db.promise().query('SELECT id, class_id FROM students WHERE user_id = ?', [userId]);
        if (students.length === 0) return res.status(404).json({ message: 'Student profile not found' });
        const studentId = students[0].id;
        const classId = students[0].class_id;

        // 2. Attendance % (Card 1) & Trend (Chart 1)
        const [attendance] = await db.promise().query(
            'SELECT status, date FROM attendance WHERE student_id = ? ORDER BY date ASC',
            [studentId]
        );
        const totalAttendance = attendance.length;
        const presentCount = attendance.filter(a => a.status === 'Present').length;
        const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

        // Attendance Trend (Last 7 records)
        const attendanceTrend = attendance.slice(-7).map(a => ({
            name: new Date(a.date).toLocaleDateString('en-US', { weekday: 'short' }),
            status: a.status === 'Present' ? 100 : 0
        }));

        // 3. GPA / Avg Score (Card 2) & Subject Performance (Chart 2)
        const [results] = await db.promise().query(
            'SELECT subject, marks, grade FROM exam_results WHERE student_id = ?',
            [studentId]
        );
        const avgScore = results.length > 0 ? (results.reduce((acc, curr) => acc + parseFloat(curr.marks), 0) / results.length).toFixed(1) : 0;

        // Subject Performance
        const subjectPerformance = results.slice(-5).map(r => ({
            subject: r.subject,
            score: parseFloat(r.marks)
        }));

        // 4. Upcoming Exams (Card 3)
        const [exams] = await db.promise().query(
            'SELECT name, start_date FROM exams WHERE class_id = ? AND start_date >= CURDATE() ORDER BY start_date ASC LIMIT 5',
            [classId]
        );

        // 5. Unread Messages (Card 4)
        const [messages] = await db.promise().query(
            'SELECT COUNT(*) as count FROM communications WHERE receiver_id = ?',
            [userId]
        );

        // 6. Announcements (Bottom panel)
        // For now, we'll use mock announcements or fetch generic ones
        const announcements = [
            { id: 1, title: 'Annual Day', content: 'Annual day celebration next month.', date: '2024-03-20' },
            { id: 2, title: 'Exam Guidelines', content: 'Please review the exam guidelines in the files section.', date: '2024-03-15' }
        ];

        res.json({
            stats: {
                attendance: attendancePercentage,
                avgScore: avgScore,
                upcomingExams: exams.length,
                unreadMessages: messages[0].count
            },
            charts: {
                attendanceTrend,
                subjectPerformance
            },
            exams: exams,
            recentResults: results.slice(-5),
            announcements: announcements
        });

    } catch (error) {
        console.error('Error fetching student dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching student stats' });
    }
};
exports.getParentDashboardStats = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Get parent and linked student ID
        const [parents] = await db.promise().query(
            'SELECT p.student_id, s.name as student_name, c.name as class_name, c.section ' +
            'FROM parents p ' +
            'JOIN students s ON p.student_id = s.id ' +
            'LEFT JOIN classes c ON s.class_id = c.id ' +
            'WHERE p.user_id = ?',
            [userId]
        );

        if (parents.length === 0) return res.status(404).json({ message: 'Parent profile or linked student not found' });

        const studentId = parents[0].student_id;
        const studentInfo = {
            name: parents[0].student_name,
            class: `${parents[0].class_name || 'N/A'} - ${parents[0].section || 'N/A'}`
        };

        // Reuse student dashboard logic for specific student
        // 2. Attendance % & Trend
        const [attendance] = await db.promise().query(
            'SELECT status, date FROM attendance WHERE student_id = ? ORDER BY date ASC',
            [studentId]
        );
        const totalAttendance = attendance.length;
        const presentCount = attendance.filter(a => a.status === 'Present').length;
        const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
        const attendanceTrend = attendance.slice(-7).map(a => ({
            name: new Date(a.date).toLocaleDateString('en-US', { weekday: 'short' }),
            attendance: a.status === 'Present' ? 100 : 0
        }));

        // 3. GPA & Performance
        const [results] = await db.promise().query(
            'SELECT subject, marks, grade, exams.name as exam_name FROM exam_results ' +
            'JOIN exams ON exam_results.exam_id = exams.id ' +
            'WHERE student_id = ?',
            [studentId]
        );
        const avgScore = results.length > 0 ? (results.reduce((acc, curr) => acc + parseFloat(curr.marks), 0) / results.length).toFixed(1) : 0;
        const subjectPerformance = results.slice(-5).map(r => ({
            subject: r.subject,
            score: parseFloat(r.marks)
        }));

        // 4. Messages (Count unread for parent)
        const [messages] = await db.promise().query(
            'SELECT COUNT(*) as count FROM communications WHERE receiver_id = ?',
            [userId]
        );

        res.json({
            studentInfo,
            stats: {
                attendance: attendancePercentage,
                avgScore: avgScore,
                unreadMessages: messages[0].count,
                gpa: (avgScore / 25).toFixed(1) // Simple conversion for GPA feel
            },
            charts: {
                attendanceTrend,
                subjectPerformance
            },
            recentResults: results.map(r => ({
                sub: r.subject,
                type: r.exam_name,
                score: r.marks,
                grade: r.grade,
                status: parseFloat(r.marks) >= 35 ? 'Passed' : 'Failed'
            })).slice(-5),
            announcements: [
                { id: 1, title: 'Annual Day', content: 'Annual day celebration next month.', date: 'Mar 20' },
                { id: 2, title: 'Exam Guidelines', content: 'Please review the exam guidelines.', date: 'Mar 15' }
            ]
        });

    } catch (error) {
        console.error('Error fetching parent dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching parent stats' });
    }
};
