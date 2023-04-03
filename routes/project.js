const express = require("express");
const router = express.Router();
const pool = require("../conDB");

router.get('/add', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('project-create-pj', data)
})

router.get('/detail', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('project-details', data)
})

module.exports = router
