const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const userSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    middlename:{
        type: String
    },
    lastname:{
        type:String,
        required:true
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;