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
            employees: JSON.stringify(rows).replace(/(\\r)*\\n/g, '<br>')
        }
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

//หน้าลบ พนักงาน
router.get('/del/:employeeId', ifNotLoggedin, async function (req, res, next) {
    const employeeId = req.params.employeeId
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM employees WHERE employee_id = ?;",
        [employeeId]);
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            employee: JSON.stringify(rows[0]).replace(/(\\r)*\\n/g, '<br>')
        }
        await conn.commit();  
        res.render('employee-del', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//หน้าแก้ไขข้อมูล พนักงาน
router.get('/edit/:employeeId', ifNotLoggedin,async function (req, res, next) {
    const employeeId = req.params.employeeId
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const [rows] = await conn.query("SELECT * FROM employees WHERE employee_id = ?;",
        [employeeId]);
        let data = {
            username: req.session.username,
            permission: req.session.permission,
            login: req.session.login,
            employee: JSON.stringify(rows[0]).replace(/(\\r)*\\n/g, '<br>')
        }
        console.log(rows[0])
        await conn.commit();  
        res.render('project-edit-employee', data)
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

//เพิ่ม พนักงาน
router.post("/add", async function (req, res, next) {
    const Firstname = req.body.empFirstname;
    const Lastname = req.body.empLastname;
    const Email = req.body.empEmail;
    const Phone = req.body.empPhone;
    const Job = req.body.empJob;
    const Salary = req.body.empSalary;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("INSERT INTO employees(employee_id, first_name, last_name, email, phone_number, job, salary) VALUES(NULL, ?, ?, ?, ?, ?, ?);", 
        [Firstname, Lastname, Email, Phone, Job, Salary]);
        await conn.commit();
        res.redirect('/employee');
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
  });

//ลบ พนักงาน
router.post("/del/:employeeId", async function (req, res, next) {
    res.redirect('/employee');
    const employeeId = req.params.employeeId;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("DELETE FROM employees WHERE employee_id = (?);", 
        [employeeId]);
        await conn.commit();
        res.redirect('/employee');
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
});

//บันทึกการแก้ไข พนักงาน
router.post('/edit/:employeeId', ifNotLoggedin,async function (req, res, next) {
    const employeeId = req.params.employeeId
    const Firstname = req.body.empFirstname;
    const Lastname = req.body.empLastname;
    const Email = req.body.empEmail;
    const Phone = req.body.empPhone;
    const Job = req.body.empJob;
    const Salary = req.body.empSalary;
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        await conn.query("UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone_number = ?, job = ?, salary = ? WHERE employee_id = ?;", 
        [Firstname, Lastname, Email, Phone, Job, Salary, employeeId]);
        await conn.commit();  
        res.redirect('/employee');
    } catch (err) {
        await conn.rollback();
    } finally {
        conn.release();
    }
})

module.exports = router