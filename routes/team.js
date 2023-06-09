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
        const [rowCheack] = await conn.query("SELECT * FROM teams");
        for (const row of rowCheack) {
            const [count] = await conn.query(
              "SELECT count(*) 'count'  FROM projects JOIN requirements USING (requirement_id)"+
              "WHERE team_name = ? AND requirement_status = 'In progress';",
              [row.team_name]
            );
            await conn.query(
              "UPDATE teams SET total_projects = ? WHERE team_name = ?;",
              [count[0].count, row.team_name]
            );
          }
        const [rows] = await conn.query("SELECT * FROM teams");
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            teams: JSON.stringify(rows).replace(/(\\r)*\\n/g, '<br>')
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

//หน้ารายละเอียดทีม
router.get('/edit/:teamName', ifNotLoggedin, async function (req, res, next) {
    const team_name = req.params.teamName
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM employees JOIN team_members USING (employee_id) WHERE team_name = ?;",
        [team_name]);
        await conn.query("UPDATE teams SET total_members = (SELECT count(employee_id) FROM team_members WHERE team_name = ?) WHERE team_name = ?;", 
        [team_name, team_name]);
        const [team] = await conn.query("SELECT * FROM teams WHERE team_name = ?;",
        [team_name]);
        const [projects] = await conn.query("SELECT requirement_id, projectname FROM projects JOIN requirements USING (requirement_id)"+
        "WHERE team_name = ? AND requirement_status = 'In progress';", [team_name]);
        console.log(projects)
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            teamName: team_name,
            projects: JSON.stringify(projects).replace(/(\\r)*\\n/g, '<br>'),
            projectCount: team[0].total_projects,
            memberCount: team[0].total_members,
            employees: JSON.stringify(rows).replace(/(\\r)*\\n/g, '<br>'),
        }
        await conn.commit();
        res.render('project-edit-team', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//หน้าเพิ่มสมาชิกทีม
router.get('/addMember/:teamName', ifNotLoggedin, async function (req, res, next) {
    const team_name = req.params.teamName
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM employees WHERE employee_id NOT IN (SELECT employee_id FROM team_members WHERE team_name = ?)",
        [team_name]);
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            teamName: team_name,
            employees: JSON.stringify(rows).replace(/(\\r)*\\n/g, '<br>'),
        }
        await conn.commit();
        res.render('project-team-add-member', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
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

//เพิ่มสมาชิกทีม
router.post('/addMember/:teamName', ifNotLoggedin, async function (req, res, next) {
    const empID = req.body.teamMemberToAdd.substring(0, req.body.teamMemberToAdd.indexOf(' '));
    const role = req.body.teamMemberRole;
    const team_name = req.params.teamName
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("INSERT INTO team_members (team_members_id, team_name, employee_id, role) VALUES (NULL, ?, ?, ?);", 
        [team_name, empID, role]);
        await conn.query("UPDATE teams SET total_members = (SELECT count(employee_id) FROM team_members WHERE team_name = ?) WHERE team_name = ?;", 
        [team_name, team_name]);
        await conn.commit();
        res.redirect("/team/edit/"+team_name)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//ลบสมาชิกทีม
router.post('/delMember/:teamName/:id', ifNotLoggedin, async function (req, res, next) {
    try {
        const [rows] = await pool.query(
            "DELETE FROM team_members WHERE team_name=? AND employee_id=?",
            [req.params.teamName, req.params.id]
        );
        res.redirect("/team/edit/"+req.params.teamName)
        
    } catch (error) {
        console.log(error);
        res.json(error);
        return next(error);
    }
})



module.exports = router