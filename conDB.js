const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  //user, password ตาม mysql ที่ติดตั้ง
  user: 'root',
  password: '',
  //database name
  database: 'project_data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3307
});

module.exports = pool;