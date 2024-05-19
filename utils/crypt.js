const bcrypt = require('bcrypt');

let encrypt = async (value) => {
    return await bcrypt.hash(value, 10);
}

let decrypt = async (value, hashValue) => {
    return await bcrypt.compare(value, hashValue);
}

module.exports = {encrypt, decrypt};