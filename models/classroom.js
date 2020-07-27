const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const classRoomSchema = new mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    name:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    instructorname:{
        type:String
    },
    fromTime:{
        type:String,
        requried:true
    },
    toTime:{
        type:String,
        required:true
    },
    daysOfClass:{
        type:Array,
        requried:true
    }
});
mongoose.model("ClassRoom",classRoomSchema);