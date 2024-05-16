const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/myapp";

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