
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
    const decodedToken = jwt.decode(token)
    const email = decodedToken.email
    const word = req.body.word;
    console.log(word)

    const idReq = await wordsSchema.findOne({ email })
    const easy1 = idReq.easy+1;
    const medium1 = idReq.medium+1;
    const hard1 = idReq.hard+1;
    const id = idReq._id.valueOf()

    console.log(easy1)
    try{
        if (word.length <= 7) {
            console.log("Stroing easy")
            const update = await wordsSchema.updateOne({ _id: id }, {
                $addToSet: {
                    knownWords: word,
    
                },
                $set: {
                    easy: easy1
                }
            })
        }
        else if (word.length > 8 && word.length <10) {
            console.log("Stpring medium")
            const update = await wordsSchema.updateOne({ _id: id }, {
                $addToSet: {
                    knownWords: word,
    
                },
                $set: {
                    medium: medium1
                }
            })
        }
        else {
            console.log("Storing hard")
            const update = await wordsSchema.updateOne({ _id: id }, {
                $addToSet: {
                    knownWords: word,
    
                },
                $set: {
                    hard: hard1
                }
            })
        }
    
    
    
        res.json({
            data: "Success",
            flag:true
        })
    
    }
    catch(e){

        res.json({
            flag:false,
            data:"ERROR"
        })
    }

})

module.exports = router