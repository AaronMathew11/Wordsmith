
const { wordsSchema, User } = require("../model.js");
const express = require('express')
const router = express.Router()
const app = express();
const path = require("path")
const cors = require("cors")
const mongoose = require("mongoose")
const hostname = '0.0.0.0';
const jwt = require("jsonwebtoken");
const { verify } = require("../verify");
const { route } = require("./regsiter.js");





router.use(verify,async (req,res)=>{

    const token = req.token
    const decodedToken = jwt.decode(token)
    const email = decodedToken.email
    const idReq = await wordsSchema.findOne({ email })
    const easy = idReq.easy
    const medium = idReq.medium;
    const hard= idReq.hard

    console.log(hard)
    res.json({
        easy,
        medium,
        hard
    })



})

module.exports = router;