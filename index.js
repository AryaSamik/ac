const connect = require("./connect.js");
const express = require("express");
const app = express();
const User = require("./models/user.js");
const asyncWrap = require("./utils/asyncWrap.js");
const ExpressError = require("./utils/ExpressError.js");
const Admin = require("./models/admin.js");
require('dotenv').config();
const {encrypt, decrypt} = require("./utils/crypt.js");

connect();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to A-C api",
        guide: {
            "/api/user" : "get, takes key as query",
            "/api/user" : "post, adds new user and takes name(firstname, middlename, lastname), dateofbirth, email, username, password in body",
            "/api/user/login" : "post, takes username and password in body",
            "/api/admin/login" : "post, takes adminid and password in body"
        }
    });
});

app.get("/api/user", asyncWrap(async(req, res, next) => {
    let {key} = req.query;
    if(key === process.env.API_KEY){
        let users = await User.find();
        res.json(users);
    }
    else{
        throw new ExpressError(400, "Invalid api key, Access Denied");
    }
}));

app.post("/api/user", asyncWrap(async(req, res, next) => {
    let user = req.body.user;
    user.password = await encrypt(user.password);
    user = new User(user);
    let response = await user.save();
    res.json({
        message:"Sign Up Successfull",
        response: response
    });
}));

app.post("/api/user/login", asyncWrap( async (req, res) => {
    let {username, password} = req.body;
    let user = await User.find({username: username});
    if(!user[0]){
        throw new ExpressError(404, "No such user exists");
    }
    else{
        if(await decrypt(password, user[0].password)){
            res.json({
                message: "Login successful",
                response: user[0]
            });
        }
        else{
            throw new ExpressError(400, "Incorrect password");
        }
    }
}));

app.post("/api/admin/login", asyncWrap( async (req, res) => {
    let {adminid, password} = req.body;
    let admin = await Admin.find({adminid: adminid});
    if(!admin[0]){
        throw new ExpressError(404, "No such admin");
    }
    else{
        if(await decrypt(password, admin[0].password)){
            res.json({
                message: `Admin ${adminid} Logged in`,
                api_key: process.env.API_KEY,
                response: admin[0]
            });
        }
        else{
            throw new ExpressError(400, "Incorrect credentials");
        }
    }
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {status = 500, message = "some error occured"} = err;
    res.status(status).json({message});
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});