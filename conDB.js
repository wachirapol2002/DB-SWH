const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  //user, password ตาม mysql ที่ติดตั้ง
  user: 'root',
  password: 'password',
  //database name
  database: '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;