const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminid: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique:true
    }
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;