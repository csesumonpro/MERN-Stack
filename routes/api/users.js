const express = require('express');
const router = express.Router();
const gravatar =  require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config =  require('config');
// Validator
const { check, validationResult } = require('express-validator');

//@route Post api/users
//@desc Register User
//@access Public

router.post('/',[
    check('name','Name is Required')
    .not()
    .isEmpty(),
    check('email','Please Enter a Valid Email').isEmail(),
    check('password','Please enter at least 6 character').isLength(6)
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }
    const {name,email,password} = req.body;
    try {
        // let user = User.findOne({email});
      
        // if(user){
        //     return res.status(500).json({"errors":[{"msg":'User ALready Exist!'}]});
        // }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });
        user = new User({
            name,email,password,avatar
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        const payload = {
           user:{
            id:user.id
           }
        }
        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn:3600},
            (err,token)=>{
             if(err) throw err   
             res.json({token})
        })
       
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
    
});

module.exports = router;