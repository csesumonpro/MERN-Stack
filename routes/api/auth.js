const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// Validator
const { check, validationResult } = require('express-validator');
//@route api/auth
//@desc Auth route
//@access Private

router.get('/',auth,async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {   
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/',[
    
    check('email','Please Enter a Valid Email').isEmail(),
    check('password','Please enter at least 6 character').exists()
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(500).json({"errors":[{"msg":'Invalid Credential!'}]});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(500).json({"errors":[{"msg":'Invalid Credential!'}]});
        }
        const payload = {
           user:{
            id:user.id
           }
        }
      
        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn:36000},
            (err,token)=>{
             if(err) throw err   
             res.json({token})
        })
     
       
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
    
});


module.exports = router;