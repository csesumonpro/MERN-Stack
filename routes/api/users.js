const express = require('express');
const router = express.Router();
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
],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }
    res.send('User Route')
});

module.exports = router;