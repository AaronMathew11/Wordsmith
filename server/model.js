const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
    email:{
        type:String,

    },
    password:{
        type:String,
  
    }
})

const wordsSchema = new Schema({
    email:{
        type:String,
    },
    topics:{
        type:[String]
    },
    knownWords:{
        type:[String]
    }

})

exports.wordsSchema = mongoose.model("Words",wordsSchema)
exports.User = mongoose.model("User",userSchema);
