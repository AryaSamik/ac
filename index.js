const connect = require("./connect.js");
const express = require("express");
const app = express();
const User = require("./models/user.js");
const asyncWrap = require("./utils/asyncWrap.js");
const api_key = "giveaccess";
const ExpressError = require("./utils/ExpressError.js");
const bcrypt = require('bcrypt');

connect();

app.use(express.urlencoded({ extended: true }));

app.get("/api/user", asyncWrap(async(req, res, next) => {
    let {token} = req.query;
    if(token === api_key){
        let users = await User.find();
        res.json(users);
    }
    else{
        throw new ExpressError(400, "Invalid api key, Access Denied");
    }
}));

app.post("/api/user", asyncWrap(async(req, res, next) => {
    let user = new User(req.body.user);
    user.password = await bcrypt.hash(user.password, 10);
    let response = await user.save();
    res.json({
        message:"Sign Up Successfull",
        response
    });
}));

app.post("/api/login", asyncWrap( async (req, res) => {
    let {username, password} = req.body;
    let user = await User.find({username: username});
    if(!user){
        throw new ExpressError(404, "No such user exists");
    }
    else{
        if(bcrypt.compare(password, user[0].password)){
            res.json({
                message:"Login successful",
                response: user[0]
            });
        }
        else{
            throw new ExpressError(400, "Incorrect password");
        }
    }
}));

app.use((err, req, res, next) => {
    let {status = 500, message = "some error occured"} = err;
    res.status(status).json({message});
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});