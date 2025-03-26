const express = require('express');
const db = require('./db');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, MySQL with Express!');
});

app.get("/employees", (req, res) => {
    const sql = "SELECT * FROM attendance_tracker.employees";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ✅ Employee Registration with Face Embedding
app.post("/register", (req, res) => {
    const { e_name, e_phone, faceEmbedding } = req.body;

    if (!faceEmbedding) return res.status(400).json({ error: "Face embedding is required" });

    const sql = "INSERT INTO attendance_tracker.employees (e_name, e_phone, face_embedding) VALUES (?, ?, ?)";
    db.query(sql, [e_name, e_phone, JSON.stringify(faceEmbedding)], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Employee registered successfully", id: result.insertId });
    });
});

// ✅ Face Recognition API
app.post("/recognize", (req, res) => {
    const { faceEmbedding } = req.body;
    console.log(faceEmbedding);
    
    if (!faceEmbedding) return res.status(400).json({ error: "Face embedding is required" });

    db.query("SELECT * FROM attendance_tracker.employees", (err, employees) => {
        if (err) return res.status(500).json({ error: "Database error" });

        let bestMatch = null;
        let minDistance = 0.6;

        employees.forEach(emp => {
            if (!emp.face_embedding) return;
            const storedEmbedding = JSON.parse(emp.face_embedding);

            const distance = Math.sqrt(storedEmbedding.reduce((sum, val, i) => sum + Math.pow(val - faceEmbedding[i], 2), 0));
            
            if (distance < minDistance) {
                bestMatch = emp;
                minDistance = distance;
            }
        });

        if (bestMatch) {
            return res.json({ match: true, employee: bestMatch });
        } else {
            return res.json({ match: false });
        }
    });
});

// ✅ Mark Attendance
app.post("/mark-attendance", (req, res) => {
    const { employee_id } = req.body;
    console.log(employee_id);
    

    if (!employee_id) return res.status(400).json({ error: "Employee ID is required" });

    const sql = "INSERT INTO attendance_tracker.attendance (e_id, date) VALUES (?, NOW())";
    db.query(sql, [employee_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ success: true, message: "Attendance marked" });
    });
});

app.listen(3001, () => {
    console.log(`http://localhost:3001`);
});
