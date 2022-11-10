

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





router.use( verify, async (req, res) => {
    console.log("Entered")
    const token = req.token
    console.log(token)
    const decodedToken = jwt.decode(token)
    const email = decodedToken.email
    const topicReq = await wordsSchema.findOne({ email })
    const topics = topicReq.topics

    console.log('Sending')
    res.json({
        topics
    })



})


module.exports = router