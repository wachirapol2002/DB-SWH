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
4. ตั้งค่า DB โดย copy/paste ไฟล์ `conDB_example.js` แล้วเปลี่ยนชื่อไฟล์ที่ copy มาเป็น `conDB.js`
   แล้วแก้ไข้ข้อมูล `user`, `password` และ `database` ในไฟล์ `conDB.js`
   ```js
   const pool = mysql.createPool({
     host: 'localhost',
     user: 'root',          // Username MySQL (ปกติเป็น root)
     password: 'password',  // รหัส MySQL ที่ตั้งไว้ตอนลง mySQL
     database: '',          // ชื่อ DB
     ...
   });
   ```
5. ทดลองใช้งาน
   ```sh
   npm run serve
   ```
