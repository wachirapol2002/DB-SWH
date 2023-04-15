const express = require("express");
const router = express.Router();
const pool = require("../conDB");
const bodyParser = require('body-parser').json();

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
        const [requirement] = await conn.query("SELECT * FROM requirements WHERE requirement_id = ?", [id]);
        const [comments] = await conn.query("SELECT * FROM comments WHERE requirement_id = ?", [id]);
        const [projectId] = await pool.query("SELECT project_id FROM projects WHERE requirement_id = ?;",[id]);
        const [status] = await conn.query("SELECT * FROM project_status WHERE project_id = ?", [projectId]);
        if(requirement[0].requirement_status != 'Not started'){
            const [project] = await conn.query("SELECT * FROM projects WHERE requirement_id = ?", [id]);
            let data = {
                username: req.session.username,
                permission: req.session.permission,
                login: req.session.login,
                requirement: JSON.stringify(requirement[0]),
                project: JSON.stringify(project[0]),
                comments: JSON.stringify(comments),
                status: JSON.stringify(status)
            }
            console.log(data)
            await conn.commit();
            res.render('project-details', data)
        }else{
            let data = {
                username: req.session.username,
                permission: req.session.permission,
                login: req.session.login,
                requirement: JSON.stringify(requirement[0]),
                project: JSON.stringify({team_name: '-', deadline: '-'}),
                comments: JSON.stringify(comments)
            }
            console.log(data)
            await conn.commit();
            res.render('project-details', data)
        }

    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//หน้าเพิ่มทีมรับผิดชอบ
router.get('/:requirementId/addteam', ifNotLoggedin, async function (req, res, next) {
    const requirementId = req.params.requirementId
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM teams");
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            requirementId: requirementId,
            teams: JSON.stringify(rows)
        }
        console.log(data)
        console.log(requirementId)
        await conn.commit();
        res.render('project-add-team', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//เพิ่มทีมรับผิดชอบ
router.post('/:requirementId/addteam', ifNotLoggedin, async function (req, res, next) {
    const requirementId = req.params.requirementId
    const teamName = req.body.teamName;
    const dateLine = req.body.dateLine;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("INSERT INTO projects (project_id, requirement_id, team_name, deadline) VALUES (NULL, ?, ?, ?);",
        [requirementId, teamName, dateLine]);
        await conn.query("UPDATE requirements SET requirement_status = 'In progress' WHERE requirement_id = ?;", 
        [requirementId]);
        await conn.commit();
        res.redirect('/project/'+requirementId+'/detail')
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
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
    } catch (error) {
    }
});

// Create new comment
router.post("/:id/comment", bodyParser, async function (req, res, next) {
    const requirementId = req.params.id;
    const username = req.session.username;
    const message = req.body.message;
    try {
        await pool.query(
            "INSERT INTO comments (requirement_id, username, message, comment_timestamp) VALUES(?, ?, ?, NOW())",
            [requirementId, username, message]
        );
        res.redirect('/project/' + requirementId + '/detail')
    } catch (error) {
        res.json(error);
        return next(error);
    }
});


// Create new status
router.post("/:id/status", bodyParser, async function (req, res, next) {
    const requirementId = req.params.id;
    const updateMessage = req.body.message;
    try {
        const [projectId] = await pool.query(
            "SELECT project_id FROM projects WHERE requirement_id = ?;",
            [requirementId]
        );
        await pool.query("INSERT INTO project_status (project_id, status_message, status_timestamp) VALUES(?, ?, NOW());",
            [projectId[0], updateMessage]
        );
        res.redirect('/project/' + requirementId + '/detail')
    } catch (error) {
        res.json(error);
        return next(error);
    }
});

module.exports = router
