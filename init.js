const connect = require("./connect.js");
const express = require("express");
const User = require("./models/user.js");
const bcrypt = require('bcrypt');

connect();

let user = new User({
    name: {
        firstname: "arya",
        lastname: "samik"
    },
    dateofbirth: new Date('2003-03-26'),
    email: "arya@gmail.com",
    username: "aryasam",
    password: "rytr26576"
});

let initDb = async () => {
    await User.deleteMany({});
    user.password = await bcrypt.hash(user.password, 10);
    user.save().then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
}

initDb();

