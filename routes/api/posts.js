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
//@route GET api/posts
//@desc Post route
//@access Private
router.get('/',auth,async (req,res)=>{
    try {
        const posts = await Post.find().sort({date:-1});
        res.json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route GET api/posts/:id
//@desc Get single post by id
//@access Private
router.get('/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post Not Found..!"});
        }
        res.json(post);
    } catch (error) {
        if(error.kind=="ObjectId"){
            return res.status(404).json({msg:"Post Not Found..!"});
        }
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route Delete api/posts/:id
//@desc delete single post by id
//@access Private
router.delete('/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post Not Found..!"});
        }
        if(post.user.toString()!==req.user.id){
            return res.status(404).json({msg:"User not authorized..!"});
        }
        await post.remove();
        res.json({msg:"Post Removed."});
    } catch (error) {
        if(error.kind=="ObjectId"){
            return res.status(404).json({msg:"Post Not Found..!"});
        }
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route PUT api/posts/like:id
//@desc Like post
//@access Private
router.put('/like/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        // Check if post already liked
       if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
           return res.status(400).json({msg:"Post already liked"});
       }
       post.likes.unshift({user:req.user.id});
       await post.save();
        res.json(post.likes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route PUT api/posts/unlike:id
//@desc Unlike post
//@access Private
router.put('/unlike/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        // Check if post already liked
       if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
           return res.status(400).json({msg:"Post has not yet been liked"});
       }
    //   Get Index
    const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex,1);
    await post.save();
    res.json(post.likes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
module.exports = router;