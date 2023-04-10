# DB-SWH
Database Project Software House Management

### Prerequisites

ติดตั้งโปรแกรมต่อไปนี้ลงเครื่อง
* [Node.js](https://nodejs.org/)

### Installation

1. Clone git repo ลงเครื่อง
   ```sh
   git clone https://github.com/wachirapol2002/DB-SWH.git
   ```
2. ติดตั้ง NPM packages
   ```sh
   npm install
   ```
4. ตั้งค่า DB โดยแก้ไขไฟล์ `conDB.js`
   ```js
   const pool = mysql.createPool({
     host: 'localhost',
     user: 'root',          // Username MySQL (ปกติเป็น root)
     password: 'password',  // รหัส MySQL ที่ตั้งไว้ตอนลง mySQL
     database: '',          // ชื่อ DB
     ...
   });
   ที่ไฟล์ swh_db SET time_zone = "+07:00";
   Query เพื่อตั้ง time zone ด้วย
   ```
5. ทดลองใช้งาน
   ```sh
   npm run serve
   ```
