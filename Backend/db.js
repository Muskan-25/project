const mysql = require('mysql2');
// import mysql from "mysql2/promise";

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    password: 'root',
    database: 'attendance_tracker'
});

db.connect((err)=>{
    if(err){
        console.log('Error connecting to mysql', err);
        return;
    }
    console.log('connected to mysql');
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS attendance_tracker.employees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            e_name VARCHAR(255) NOT NULL,
            e_phone VARCHAR(20) NOT NULL,
            image_url longtext NOT NULL
        )`;
    
    db.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log("Employees table ensured.");
    });
});

module.exports =  db;