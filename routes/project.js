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
router.get('/', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-table', data)
})

//หน้าเพิ่ม Project
router.get('/add', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-create-pj', data)
})

//หน้ารายละเอียด Project
router.get('/detail', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-details', data)
})

router.post("/add", async function (req, res, next) {
    const projectName = req.body.projectName;
    const projectDetails = req.body.projectDetails;
    const projectTimeframe = req.body.projectTimeframe;
    const projectOwnerContact = req.body.projectOwnerContact;
    const username = req.session.username;
    console.log(req.session)
    console.log(req.body);
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("INSERT INTO requirements(requirement_id, username, projectname, detail, budget, contact, require_timestamp, requirement_status) VALUES(NULL, ?, ?, ?, ?, ?, NOW(), 'Not started');", 
        [username, projectName, projectDetails, projectTimeframe, projectOwnerContact]);
        await conn.commit();
        res.redirect('/project');
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
  });

module.exports = router
