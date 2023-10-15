const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const User = require('../models/User')
const fetchUser = require('../middleware/fetchUser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const jWT_key = process.env.SECRET_KEY

// Route 1: create a user using POST  "/api/auth/createuser". No login required
router.post('/createuser',[
   body('email','Type a valid Email').isEmail(),
   body('name','type a valid name').isLength({min: 2}),
   body('password','type a valid password').isLength({min: 5})
], async ( req , res)=>{
  let success=false;
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
    //handle body errors
    success=false
      return res.status(400).json({success, errors : errors.array() })
   }
   // try catch
   try{
    // hash,salt added to password
     const salt = await bcrypt.genSalt(10)
     const scretpass =await bcrypt.hash(req.body.password,salt)
     //create user
    let user = await User.create({
      name : req.body.name,
      password : scretpass,
      email : req.body.email
     })
     //JWT Token
     const data = {
      user :{
        id : user.id
      }
     }
     const jwt_token = jwt.sign(data, jWT_key)
     success=true
     res.json({success,jwt_token})
   }
   catch(err){
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      // Handle duplicate email error
      success=false
      res.status(400).json({success, error: "Email already exists!" });
    } else {
      // Handle other potential errors
      success=false
      res.status(500).json({success, error: "Internal server error" });
    }
   }
})


// Route 2:Login a user using POST  "/api/auth/login". No login required
router.post('/login',[
  body('email','Incorrect Email').isEmail(),
  body('password','Cannot be blank').exists()
], async ( req , res)=>{
  let success = false;
  const error = validationResult(req);
  if(!error.isEmpty()){
    success=false
    return res.status(400).json({ success,errors : error.array() })
  }
  const {email , password } = req.body;
  try {
    //find entered email
    const  user = await User.findOne({email});
    if(!user){
      success=false;
     return res.status(400).json({success,error: 'incorrect details'})
    }
    //compare password
    const passwordcompare= await bcrypt.compare(password,user.password)
    if(!passwordcompare){
      success=false;
      return res.status(400).json({success,error: 'incorrect details'})
    }
    //JWT Token
    const data = {
      user :{
        id : user.id
      }
     }
     const jwt_token = jwt.sign(data, jWT_key)
     success=true;
     res.json({success,jwt_token})

  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      // Handle duplicate email error
      return res.status(400).json({ error: "Email already exists!" });
    } else {
      // Handle other potential errors
      return res.status(500).json({ error: "Internal server error" });
    }
  }
})


// Route:3 get logged in user detail using "/api/auth/userdetail"
router.post('/userdetails',fetchUser,async(req,res)=>{
  try {
    const userid=req.user.id
    const user =await User.findById(userid).select('-password')
    res.send(user)
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
})



module.exports= router