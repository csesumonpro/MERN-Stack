const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
//@route api/profile/me
//@desc Get Current User Profile
//@access Private

router.get('/me',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id}).populate('user',
        ['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route Post api/profile/
//@desc Create or Update User
//@access Private
router.post('/',[auth,[
check('status','Status field is required!').not().isEmpty(),
check('skills','Skills field is required!').not().isEmpty(),
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {company,website,location,bio,status,skills,githubusername,facebook,twitter,linkedin,instagram,youtube} = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company)  profileFields.company = company;
    if(website)  profileFields.website = website;
    if(location)  profileFields.location = location;
    if(bio)  profileFields.bio = bio;
    if(status)  profileFields.status = status;
    if(githubusername)  profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill=>skill.trim()); 
    }
//   Build Social Object
    profileFields.social = {};
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;
    if(youtube) profileFields.social.youtube = youtube;
    try {
        let profile = await Profile.findOne({user:req.user.id});
        if(profile){
            // Update
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            )
            return res.json(profile);
        }
        // New profile Create
        profile = new Profile(profileFields);
        profile.save();
        return res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route GET api/profile/
//@desc get all user
//@access Public
router.get('/',async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['avatar','name']);
        res.json(profiles);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route GET api/profile/
//@desc get all user
//@access Public
router.get('/user/:user_id',async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['avatar','name']);
        if(!profile){
            return res.status(400).json({msg:"Profile Not Found...!"});
        }
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        if(error.kind=='ObjectId'){
            return res.status(400).json({msg:"Profile Not Found...!"});
        }
        res.status(500).send('Server Error')
    }
});
//@route DELETE api/profile/
//@desc delete profile and user
//@access Private
router.delete('/',auth,async (req,res)=>{
    try {
     await Profile.findOneAndRemove({user:req.user.id});
     await User.findOneAndRemove({_id:req.user.id});
        res.json({msg:"User Deleted"});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route PUT api/profile/experience/
//@desc add experience
//@access Private
router.put('/experience',[auth,[
    check('title','Title field is required!').not().isEmpty(),
    check('company','Company field is required!').not().isEmpty(),
    check('location','Location field is required!').not().isEmpty(),
    check('from','From field is required!').not().isEmpty()
]],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {title,company,location,from,to,current,description} = req.body;
    const  newExp = {
        title,company,location,from,to,current,description
    };
    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route DELETE api/profile/experience/:exp_id
//@desc delete profile experience
//@access Private
router.delete('/experience/:exp_id',auth,async (req,res)=>{
    try {
    const profile = await Profile.findOne({user:req.user.id});
   
    const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route PUT api/profile/education/
//@desc add education
//@access Private
router.put('/education',[auth,[
    check('school','School field is required!').not().isEmpty(),
    check('degree','Degree field is required!').not().isEmpty(),
    check('fieldofstudy','Field of Study field is required!').not().isEmpty(),
    check('from','From field is required!').not().isEmpty()
]],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {school,degree,fieldofstudy,from,to,current,description} = req.body;
    const  newEdu = {
        school,degree,fieldofstudy,from,to,current,description
    };
    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
//@route DELETE api/profile/ducation/:edu_id
//@desc delete profile education
//@access Private
router.delete('/education/:edu_id',auth,async (req,res)=>{
    try {
    const profile = await Profile.findOne({user:req.user.id});
    const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});

//@route GET api/profile/github/:username
//@desc get all github repo by username
//@access Public
router.get('/github/:username',(req,res)=>{
    try {
        const options = {
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:desc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
           method:'GET',
           headers:{'user-agent':'node-js'}
        }
        request(options,(error,response,body)=>{
            if(error) console.log(error)
            if(response.statusCode!=200){
                return res.status(404).json({msg:"No github profile found!!"});
            }
            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});
module.exports = router;