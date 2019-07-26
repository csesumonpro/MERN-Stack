const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
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
        profileFields.skills = skills.split(',').map(skill=>skill.trim()) 
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
module.exports = router;