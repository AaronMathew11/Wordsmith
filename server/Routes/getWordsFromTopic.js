


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



router.use("",verify,async(req,res)=>{

    const token = req.token
    const decodedToken = jwt.decode(token)
    const email = decodedToken.email
    // const difficulty = req.body.difficulty;

    // const wordLen = difficulty == "easy" ? 5 : difficulty == "medium" ? 7 : difficulty == "hard" ? 7 : null
    // console.log(wordLen)
    let wordsToDisplay = []

    //Get the selected topics from db

    const topics = [req.body.topic]
    console.log("Finding is:", topics.length);

    //Get all the words related to that from datamuse

    //Words that User know
    const userWordsReq = await wordsSchema.findOne({ email });
    const knownWords = userWordsReq.knownWords;


    for (let k = 0; k < topics.length; k++) {

        let num = 0;
        let totalWords = 0;
        let temp = 0;
        while (num < 5) {

            totalWords = totalWords + 5;
            const reqWord = await (await fetch(`https://api.datamuse.com/words?ml=${topics[k]}&max=${totalWords}&md=d`)).json()

            // let words = reqWord.filter((obj, i) => {

            //     if (i >= totalWords - 10 && i < totalWords) {
            //         return {
            //             word: obj.word,
            //             defs: obj.defs
            //         }
            //     }

            // })
            let words = []
            for (let i = temp; i < reqWord.length; i++) {

                words.push(reqWord[i]);

            }

            words = words.map((obj) => {
                return {
                    word: obj.word,
                    defs: obj.defs
                }
            })

   
            // words = words.filter((v) => {

            //     if (v.word.length <= wordLen) {
            //         return v;
            //     }
            // })

            //Delete words that user already knows
     
  

            let i=0;
            while(i<words.length){
                let flag=false;
                const word = words[i].word;
        
                for (let j = 0; j < knownWords.length; j++) {
                 
                    if (word == knownWords[j]) {
                 
                        flag=true
                        words.splice(i, 1);

                        console.log(words)
                        break;
                    }
                }

                if(flag==true){
                    i=0;

                }
                else{
                    i++
                }
            }

            // console.log("After")
            
            // for(let i=0;i<words.length;i++){
            //     console.log(words[i].word)
            // }
            wordsToDisplay.push(...words)
    
            num = num + words.length
            temp = temp + 5;

        }


    }


    // console.log(wordsToDisplay)

    for(let i=0;i<wordsToDisplay.length;i++){
        console.log(wordsToDisplay[i].word)
    }

    res.json({
        wordsToDisplay
    })

})


module.exports = router