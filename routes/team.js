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
router.get('/', ifNotLoggedin, (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('team-table', {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    })
})

//หน้าสร้าง ทีม
router.get('/create', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-create-team', data)
})

//หน้าปรับแต่งทีม
router.get('/edit', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-edit-team', data)
})

//หน้าเพิ่มสมาชิกทีม
router.get('/add', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-team-add-member', data)
})

//หน้ารายละเอียดทีม
router.get('/detail', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('team-details-table', data)
})



module.exports = router