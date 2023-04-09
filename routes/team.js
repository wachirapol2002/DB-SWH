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
    var data = { title: '', data: 'data' }
    res.render('team-table', {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    })
})

router.get('/create', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-create-team', data)
})

router.get('/edit', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-edit-team', data)
})

router.get('/add', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('project-team-add-member', data)
})

router.get('/detail', ifNotLoggedin, (req, res) => {
    let data = {
        username: req.session.username,
        permission: req.session.permission,
        login: req.session.login
    }
    res.render('team-details-table', data)
})



module.exports = router