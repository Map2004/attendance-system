const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// เส้นทางสำหรับหน้าแรก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'attendance_db'
});

app.get('/api/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/attendance', (req, res) => {
    const attendance = req.body.attendance;
    const query = 'INSERT INTO attendance (studentId, date, status) VALUES (?, CURDATE(), ?)';
    
    attendance.forEach(record => {
        db.query(query, [record.studentId, record.status], (err) => {
            if (err) return res.status(500).send(err);
        });
    });
    
    res.status(200).send('Attendance saved.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
