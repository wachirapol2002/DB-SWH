const express = require("express");
const router = express.Router();
const pool = require("../conDB");

router.get('/', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('team-table', data)
})

router.get('/create', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('project-create-team', data)
})

router.get('/edit', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('project-edit-team', data)
})

router.get('/add', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('project-team-add-member', data)
})

router.get('/detail', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('team-details-table', data)
})



module.exports = router