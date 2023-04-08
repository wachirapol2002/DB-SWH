const express = require("express");
const router = express.Router();
const pool = require("../conDB");

router.get('/login', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('login', data)
})

router.get('/register', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('register', data)
})

module.exports = router