const express = require("express");
const router = express.Router();
const pool = require("../conDB");

router.get('/login', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('login', data)
})

router.get('/register', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('register', data)
})


router.post("/register", async function (req, res, next) {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    const conn = await pool.getConnection()
    // Begin transaction
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM accounts WHERE username = ?", [username]);
        if (rows.length > 0) {
            res.render('register', {alert: "มีชื่อผู้ใช้งานนี้แล้ว"})
        } else {
            await conn.query("INSERT INTO accounts(username, password, permission) VALUES(?, ?, 'customer');", [username, password]);
            await conn.commit();
            res.redirect('/login');
        }
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
  });

module.exports = router