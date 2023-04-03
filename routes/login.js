const express = require("express");
const router = express.Router();
const pool = require("../conDB");

router.get('/', (req, res) => {
    var data = { title: '', data: 'data' }
    res.render('login', data)
})

module.exports = router