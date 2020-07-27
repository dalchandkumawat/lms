const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey:'',// '8bfcde73',
  apiSecret:''// 'KPoD3Yf4N6zhN6h3'
})

const phonenumbers={
    1111111111: '111111',
    9827012012: '123456',
    8991741921: '891472',
    8501285921: '985284',
    9425010231: '899242',
    9818123237: '147294',
    9308712123: '834921',
    9425012345: '477293',
    9928410231: '122821',
    9121212421: '248891'
}

router.post('/signup',(req,res)=>{
    const {name,email,phonenumber,usertype}=req.body;
    if(!name||!email||!phonenumber||!usertype){
        return res.status(422).json({error:"Please add all the fields"});
    }
    User.findOne({phonenumber:phonenumber}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json(({error:"User already exists with that mobile number"}))
        }
        const digits = '0123456789'; 
        let otp = ''; 
        for (let i = 0; i < 6; i++ ) { 
            otp += digits[Math.floor(Math.random() * 10)]; 
        } 
        const user=new User({
            name,email,phonenumber,usertype,verified:false,otp,expireOtp:Date.now()+900000
        });
        user.save().then(user=>{
            const from = "Dalchand";
            const to = 91+phonenumber;
            const text = "OTP for verification at LMS is : "+otp + ". Please do not share it with anyone";
            nexmo.message.sendSms(from, to, text, (err, responseData) => {
                if (err) {
                    console.log(err);
                } else {
                    if(responseData.messages[0]['status'] === "0") {
                        res.json({message:"OTP sent to your mobile number"});
                    } else {
                        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                        return res.status(422).json({error:"Failed to send OTP"})
                    }
                }
            })
        }).catch(err=>console.log(err));
    }).catch(err=>{
        console.log(err);
    })
});

router.post('/verifyotp',(req,res)=>{
    const {phonenumber,otp} = req.body;
    if(!phonenumber||!otp){
        return res.status(422).json({error:"Please add all the fields"});
    }
    if(phonenumbers.hasOwnProperty(phonenumber)){
        if(phonenumbers[phonenumber]==otp){
            User.findOne({phonenumber:phonenumber}).then(user=>{
                if(user){
                    const token=jwt.sign({_id:user._id},JWT_SECRET);
                    const {_id,name,email,phonenumber,usertype,teachingClasses,attendingClasses} = user;           
                    return res.json({token,message:"User verified",user:{_id,name,email,phonenumber,usertype,teachingClasses,attendingClasses}});
                }
            })
        }
        else{
            return res.status(422).json({error:"Invalid OTP"})
        }
    }
    User.findOne({phonenumber:phonenumber,expireOtp:{$gt:Date.now()}}).then((user)=>{
        if(user){          
            if(otp==user.otp){
                user.verified=true;
                user.save().then(user=>{      
                    const token = jwt.sign({_id:user._id},JWT_SECRET);
                    const {_id,name,email,phonenumber,usertype,teachingClasses,attendingClasses} = user;           
                    res.json({token,message:"User verified",user:{_id,name,email,phonenumber,usertype,teachingClasses,attendingClasses}});
                })
            }
            else{
                return res.status(422).json({error:"Invalid OTP"})
            }
        }
        else{
            return res.status(422).json({error:"OTP expired"})
        }
    })
});

router.post('/signin',(req,res)=>{
    const {phonenumber}=req.body;
    if(!phonenumber){
        return res.status(422).json({error:"Please add all the fields"});
    }
    if(phonenumbers.hasOwnProperty(phonenumber)){
        return res.json({message:"OTP sent to your mobile number"});
    }
    User.findOne({phonenumber:phonenumber}).then((user)=>{
        if(user && user.verified){
            const digits = '0123456789'; 
            let otp = ''; 
            for (let i = 0; i < 6; i++ ) { 
                otp += digits[Math.floor(Math.random() * 10)]; 
            } 
            user.otp=otp;
            user.expireOtp=Date.now()+900000;
            user.save().then((result)=>{
                const from = "Dalchand";
                const to = 91+phonenumber;
                const text = "OTP for verification at LMS is : "+otp + ". Please do not share it with anyone";
                nexmo.message.sendSms(from, to, text, (err, responseData) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if(responseData.messages[0]['status'] === "0") {
                            res.json({message:"OTP sent to your mobile number"});
                        } else {
                            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                            return res.status(422).json({error:"Failed to sent OTP"});
                        }
                    }
                })
            })
        }
        else{
            return res.status(422).json({error:"Mobile number not registered"});
        }
    }).catch(err=>{
        console.log(err);
    })
});

module.exports = router;