var jwt = require('jsonwebtoken');


const veryfiToken = async(req,res,next) => {
    const token = req.cookies.token;
    console.log(token);
    
}

module.exports = veryfiToken


