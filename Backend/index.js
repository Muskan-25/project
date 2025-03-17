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
    const sql = "SELECT * FROM employees";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});


app.post("/register", (req, res) => {
  const { e_name, e_phone, image_url } = req.body;

  const sql = "INSERT INTO employees (e_name, e_phone, image_url) VALUES (?, ?, ?)";
  db.query(sql, [e_name, e_phone, image_url], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Employee registered successfully", id: result.insertId });
  });
});

app.listen(3001, ()=>{
    console.log(`http://localhost:3001`);
})