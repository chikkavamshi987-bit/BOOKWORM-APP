const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const User = mongoose.model('UserInfo');

const protectRoute = async(req, res, next) =>{
    const authHeader = req.headers.authorization;
    // console.log(req.headers.authorization)
    if(!authHeader){
            return res.send({status:'error', data:'didnot receive token'})
        }
        const token = authHeader.split(" ")[1];
    try{
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decodeToken.documentId)
        const user = await  User.findById(decodeToken.documentId).select("-password")
        if(!user){
            return res.send({status:401,data:"Token is not vaild"})
        }
        console.log(user)
        req.user=user;
        next();
    }catch(error){
        console.error("Authentication error:", error.message);
        res.status(401).json({ message: "Token is not valid" });
    }
}

module.exports = protectRoute;