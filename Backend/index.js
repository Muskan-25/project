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
app.post("/register", async (req, res) => {
  try {
      const { e_name, e_phone, image_url, faceEmbedding } = req.body;

      if (!Array.isArray(faceEmbedding)) {
          return res.status(400).json({ error: "Invalid face embedding format" });
      }

      const sql = "INSERT INTO attendance_tracker.employees (e_name, e_phone, image_url, face_embedding) VALUES (?, ?, ?, ?)";
      db.query(sql, [e_name, e_phone, image_url, JSON.stringify(faceEmbedding)], (err, result) => {
          if (err) {
              console.error("Error inserting employee:", err);
              res.status(500).json({ error: "Database error" });
          } else {
              res.status(200).json({ message: "Employee registered successfully!" });
          }
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Invalid JSON format" });
  }
});






// ✅ Face Recognition API
app.post("/recognize", async (req, res) => {
  try {
      const { faceEmbedding } = req.body;

      if (!Array.isArray(faceEmbedding)) {
          return res.status(400).json({ error: "Invalid face embedding format" });
      }

      db.query("SELECT * FROM attendance_tracker.employees", (err, employees) => {
          if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ error: "Database error" });
          }

          let bestMatch = null;
          let minDistance = 0.6;

          employees.forEach(emp => {
              if (!emp.face_embedding) return;

              let storedEmbedding = emp.face_embedding;  // 🟢 MySQL se JSON mil raha hai, parse nahi karna
              if (!Array.isArray(storedEmbedding) || storedEmbedding.length !== faceEmbedding.length) {
                  console.error("Invalid embedding format:", storedEmbedding);
                  return;
              }

              const distance = Math.sqrt(
                  storedEmbedding.reduce((sum, val, i) => sum + Math.pow(val - faceEmbedding[i], 2), 0)
              );

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
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Invalid JSON format" });
  }
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
