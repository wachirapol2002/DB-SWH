const express = require("express");
const router = express.Router();
const pool = require("../conDB");

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.login){
        return res.redirect('/');
    }
    next();
}

//หน้าตาราง พนักงาน
router.get('/', ifNotLoggedin, async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM employees");
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            employees: JSON.stringify(rows)
        }
        console.log(rows)
        await conn.commit();  
        res.render('employees-table', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//หน้าเพิ่ม พนักงาน
router.get('/add', ifNotLoggedin, async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-create-employee', data)
})

//หน้าลบ ทีม
router.get('/del/:employeeId', ifNotLoggedin, async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login,
    }
    res.render('employee-del', data)
    const employeeId = req.params.employeeId
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM employees WHERE employee_id = ?;"
        [employeeId]);
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            employee: JSON.stringify(rows[0])
        }
        console.log(rows)
        await conn.commit();  
        res.render('employee-del', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//หน้าปรับปรุง พนักงาน
router.get('/edit', ifNotLoggedin,async function (req, res, next) {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-edit-employee', data)
})

//เพิ่ม team
router.post("/add", async function (req, res, next) {
    const Firstname = req.body.empFirstname;
    const Lastname = req.body.empLastname;
    const Email = req.body.empEmail;
    const Phone = req.body.empPhone;
    const Role = req.body.empRole;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("INSERT INTO employees(employee_id, first_name, last_name, email, phone_number, job) VALUES(NULL, ?, ?, ?, ?, ?);", 
        [Firstname, Lastname, Email, Phone, Role]);
        await conn.commit();
        res.redirect('/employee');
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
  });

module.exports = router