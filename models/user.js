const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    usertype:{
        type:String,
        required:true
    },
    verified:Boolean,
    otp:String,
    expireOtp:Date,
    teachingClasses:[{
        type:ObjectId,ref:"ClassRoom"
    }],
    attendingClasses:[{
        type:String
    }]
});
mongoose.model("User",userSchema);