const express = require("express");
const router = express.Router();
const pool = require("../conDB");

//check login
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.login){
        return res.redirect('/');
    }
    next();
}

//หน้าตาราง ทีม
router.get('/', ifNotLoggedin, async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM teams");
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            teams: JSON.stringify(rows)
        }
        await conn.commit();
        res.render('team-table', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//หน้าสร้าง ทีม
router.get('/create', ifNotLoggedin, async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-create-team', data)
})

//หน้าลบ ทีม
router.get('/del/:teamName', ifNotLoggedin, async function (req, res, next) {
    const team_name = req.params.teamName
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login,
        teamName: team_name
    }
    res.render('team-del', data)
})

//หน้าปรับแต่งทีม
router.get('/edit', ifNotLoggedin, async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-edit-team', data)
})

//หน้าเพิ่มสมาชิกทีม
router.get('/add', ifNotLoggedin, async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-team-add-member', data)
})

//หน้ารายละเอียดทีม
router.get('/detail', ifNotLoggedin, async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('team-details-table', data)
})

//สร้าง team
router.post("/create", async function (req, res, next) {
    const teamName = req.body.teamName;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("INSERT INTO teams(team_name, total_members, total_projects) VALUES(?, 0, 0);", 
        [teamName]);
        await conn.commit();
        res.redirect('/team');
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
  });

//ลบ team
router.post("/del/:teamName", async function (req, res, next) {
    const teamName = req.params.teamName;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("DELETE FROM teams WHERE team_name = (?);", 
        [teamName]);
        await conn.commit();
        res.redirect('/team');
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
});



module.exports = router