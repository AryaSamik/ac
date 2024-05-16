const mongoose = require("mongoose");

const MONGO_URL = "mongodb+srv://aryasamik:2hOMGQULBfTWMPsf@cluster0.hvlzfwk.mongodb.net/";

let connect = () => {
    mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports = connect;
// connect();