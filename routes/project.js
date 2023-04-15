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

//หน้าตาราง Project
router.get('/', ifNotLoggedin, async function (req, res, next) {
    const username = req.session.username;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM requirements WHERE username = ?", [username]);
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            requirement: JSON.stringify(rows)
        }
        await conn.commit();
        res.render('project-table', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//หน้าเพิ่ม Project
router.get('/add', ifNotLoggedin, async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-create-pj', data)
})

//หน้ารายละเอียด Project
router.get('/:id/detail', ifNotLoggedin, async function(req, res, next) {
    const id = req.params.id
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM requirements WHERE requirement_id = ?", [id]);
        const [rows2] = await conn.query("SELECT * FROM comments WHERE requirement_id = ?", [id]);
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            requirement: JSON.stringify(rows[0]),
            comments: JSON.stringify(rows2)
        }
        console.log(data)
        await conn.commit();
        res.render('project-details', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//หน้าเพิ่มทีมรับผิดชอบ
router.get('/addteam', ifNotLoggedin, async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-add-team', data)
})

//เพิ่มRequirements
router.post("/add", async function (req, res, next) {
    const projectName = req.body.projectName;
    const projectDetails = req.body.projectDetails;
    const projectBudget = req.body.projectBudget;
    const projectOwnerContact = req.body.projectOwnerContact;
    const username = req.session.username;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("INSERT INTO requirements(requirement_id, username, projectname, detail, budget, contact, require_timestamp, requirement_status) VALUES(NULL, ?, ?, ?, ?, ?, NOW(), 'Not started');", 
        [username, projectName, projectDetails, projectBudget, projectOwnerContact]);
        await conn.commit();
        res.redirect('/project');
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
});


// Get comments
router.get("/:id/comments", async function (req, res, next) {
    try {
        const [rows, fields] = await pool.query(
            "SELECT * FROM comments WHERE requirement_id=?",
            [req.params.id]
        );

        res.json(rows);
        console.log(rows)
    } catch (error) {
        console.log(error)
    }
});

// Create new comment
const bodyParser = require('body-parser').json();
router.post("/:id/comment", bodyParser, async function (req, res, next) {
    const username = 'admin';
    try {
        const [rows, fields] = await pool.query(
            "INSERT INTO comments (requirement_id, username, message, comment_timestamp) VALUES(?, ?, ?, NOW())",
            [req.params.id, req.session.username, req.body.message]
        );
        console.log({
            comment_id: rows.insertId,
            requirement_id: req.params.id,
            username: req.session.username,
            message: req.body.message,
            timestamp: Date.now(),
        });
        res.redirect('/project/' + req.params.id + '/detail')
    } catch (error) {
        console.log(error);

        res.json(error);
        return next(error);
    }
});

module.exports = router
