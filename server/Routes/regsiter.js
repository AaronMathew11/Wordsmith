


const { wordsSchema, User } = require("../model.js");
const express = require('express')
const router = express.Router()

router.use(async (req, res) => {


    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)

    const user = new User({
        email, password
    })

    const UserWords = new wordsSchema({
        email,
        topics: [],
        knownWords: [],
        easy: 0,
        medium: 0,
        hard: 0
    })

    const finding = await User.findOne({ email })

    console.log(finding)
    if (finding === null) {

        user.save().then(data => {
            console.log(data)
            UserWords.save().then((v) => {
                res.status(200).json({
                    data: "Registered",
                    flag: true
                })
            })

        })

    }
    else {
        console.log("hehe")
        res.status(400).json({
            data: "User already available",
            flag: false
        })

    }



})



module.exports = router