const express = require("express");
const router = express.Router();
const pool = require("../conDB");

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.login){
        return res.redirect('/');
    }
    next();
}

router.get('/', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('employees-table', data)
})

router.get('/add', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-create-employee', data)
})

router.get('/edit', ifNotLoggedin,(req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-edit-employee', data)
})

module.exports = router