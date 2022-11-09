const express = require("express");
const app = express();
const path = require("path")
const cors = require("cors")
const mongoose = require("mongoose")
const hostname = '0.0.0.0';
const { wordsSchema, User } = require("./model");
const jwt = require("jsonwebtoken");
const { verify } = require("./verify")

const PORT = process.env.PORT || 4010

app.use(cors())
app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: false }));
app.use(express.json())



app.use("/register", async (req, res) => {


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

app.use("/login", async (req, res) => {

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


app.use("/storeTopic", verify, async (req, res) => {

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

app.use("/getTopics", verify, async (req, res) => {
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


app.use("/getDifficultyLevel",verify,async (req,res)=>{

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


app.use("/storeWords", verify, async (req, res) => {

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
        if (word.length <= 5) {
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
        else if (word.length == 6) {
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

app.use("/getWords", verify, async (req, res) => {

    const token = req.token
    const decodedToken = jwt.decode(token)
    const email = decodedToken.email
    // const difficulty = req.body.difficulty;

    // const wordLen = difficulty == "easy" ? 5 : difficulty == "medium" ? 7 : difficulty == "hard" ? 7 : null
    // console.log(wordLen)
    let wordsToDisplay = []

    //Get the selected topics from db
    const finding = await wordsSchema.findOne({ email })
    const topics = finding.topics
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


app.use("/getWordsFromTopic",verify,async(req,res)=>{

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

app.use("/", (req, res) => {
    res.send("Hello")
})

mongoose.connect("mongodb+srv://Athul:Athul@cluster0.qhzaz.mongodb.net/?retryWrites=true&w=majority").then(result => {
    console.log("Conncted")
    app.listen(PORT);
}).catch(
    err => {
        console.log("Error")
    }
)
