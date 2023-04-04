const express = require("express");
const router = express.Router();
const pool = require("../conDB");

router.get('/', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('project-create-employee', data)
})

router.get('/add', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('project-create-employee', data)
})

router.get('/edit', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('project-edit-employee', data)
})

module.exports = router