
const { wordsSchema, User } = require("../model.js");
const express = require('express')
const router = express.Router()
const app = express();
const path = require("path")
const cors = require("cors")
const mongoose = require("mongoose")
const hostname = '0.0.0.0';
const jwt = require("jsonwebtoken");
const { verify } = require("../verify")


router.use(async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const user = new User({
        email, password
    })

    const finding = await User.findOne({ email, password })

    if (finding === null) {
        console.log("HI")
        res.status(400).json({
            data: "User Not already available",
            flag: false
        })

    }
    else {
        var token = jwt.sign({ email }, 'shhhhh');
        console.log(token)
        res.json({
            token,
            flag: true
        })
        //Send JWT TOKEN


    }
    console.log(finding)

})


module.exports = router