const jwt = require('jsonwebtoken')
require('dotenv').config();
const jWT_key = process.env.SECRET_KEY


const fetchuser= (req,res,next)=>{
    // getting jwt token from header
    const token = req.header('jwt-token')
    if(!token){
        res.status(500).send({error : 'invalid token details'})
    }
    try {
        const data = jwt.verify(token,jWT_key)
        req.user=data.user
        next()
    } catch (error) {
        res.status(500).send({error : 'invalid token details'})
    }


}
module.exports= fetchuser