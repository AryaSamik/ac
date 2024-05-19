const connect = require("./connect.js");
const express = require("express");
const app = express();
const User = require("./models/user.js");
const asyncWrap = require("./utils/asyncWrap.js");
const ExpressError = require("./utils/ExpressError.js");
const Admin = require("./models/admin.js");
require('dotenv').config();
const {encrypt, decrypt} = require("./utils/crypt.js");
const jwt = require("jsonwebtoken");

connect();

app.use(express.urlencoded({ extended: true }));

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
    let obj = {
        username: user.username,
        password: user.password
    };
    user.token = jwt.sign(obj, "secretUser");
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
        let obj = {
            username: username,
            password: password
        };
        //NEED TO ADD JWT VERIFICATION
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
    let {adminid, password, token} = req.body;
    let admin = await Admin.find({adminid: adminid});
    if(!admin[0]){
        throw new ExpressError(404, "No such admin");
    }
    else{
        if(await bcrypt.compare(password, admin[0].password) && token === admin[0].token){
            res.json({
                message: `Admin ${adminid} Logged in`,
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