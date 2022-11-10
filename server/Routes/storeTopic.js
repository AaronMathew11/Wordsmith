
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



router.use(verify, async (req, res) => {

    const token = req.token
    console.log(token)
    const decodedToken = jwt.decode(token)
    const email = decodedToken.email
    const topics = req.body.topics;
    console.log(topics)
    const idReq = await wordsSchema.findOne({ email })
    const id = idReq._id.valueOf()
    console.log(id)

    const update = await wordsSchema.updateOne({ _id: id }, {
        $addToSet: {
            topics: topics
        }
    })

    console.log(update)
    if (update.acknowledged) {
        res.json(
            {
                data: "Success"
            }
        )
    }
    else {
        res.json({
            data: "Failed"
        })
    }

})

module.exports = router
