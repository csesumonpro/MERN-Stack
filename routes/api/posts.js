const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//@route Post api/posts
//@desc Post route
//@access Private

router.post('/',[auth,[
    check('text','Text field is required!').not().isEmpty(),
]],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
   try {
       const user = await User.findById(req.user.id).select('-password');
       const newPost = {
           text:req.body.text,
           name:req.body.name,
           avatar:user.avatar,
           user:req.user.id
       }
       const post = await new Post(newPost);
       post.save();
       res.json(post);
   } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
   }

});

module.exports = router;