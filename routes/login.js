const express = require("express");
const router = express.Router();
const pool = require("../conDB");

//check login ไปหน้า login ก่อน
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.login){
        return res.render('login');
    }
    next();
}
const ifLoggedin = (req,res,next) => {
    if(req.session.login){
        return res.redirect('/project/')
    }
    next();
}

//หน้า root ไป ตาราง Project ถ้า login แล้ว
router.get('/', ifNotLoggedin, async function (req, res, next) {
    res.redirect('/project/')
})

//หน้า สมัครบัญชี
router.get('/register', ifLoggedin,async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('register', data)
})

//post เพื่อ register
router.post("/register", ifLoggedin, async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM accounts WHERE username = ?", [username]);
        if (rows.length > 0) {
            res.render('register', {alert: "มีชื่อผู้ใช้งานนี้แล้ว"})
        } else {
            await conn.query("INSERT INTO accounts(username, password, permission) VALUES(?, ?, 'customer');", [username, password]);
            await conn.commit();
            res.redirect('/');
        }
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
  });

  //post เพื่อ login
  router.post("/login", ifLoggedin, async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM accounts WHERE username = ? and password = ?", [username, password]);
        if (rows.length == 1) {
            req.session.login = true;
            req.session.username = rows[0].username;
            req.session.permission = rows[0].permission;
            res.redirect('/project/');
        } else {
            res.render('login', {alert: "รหัสผ่านผิดพลาด"})
        }
        await conn.commit();
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
  });

  //logout ทำลาย session
  router.get('/logout',(req,res)=>{
    req.session = null;
    res.redirect('/');
});

module.exports = router
