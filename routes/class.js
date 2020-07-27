const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ClassRoom=mongoose.model("ClassRoom");
const User = mongoose.model("User");
const requireLogin = require('../middlewares/requireLogin');

router.post('/addclass',requireLogin,(req,res)=>{
    const {id,name,subject,fromTime,toTime,daysOfClass} = req.body;
    const classRoom=new ClassRoom({
        id,name,subject,fromTime,toTime,daysOfClass,instructorname:req.user.name
    });
    classRoom.save().then((result)=>{
        if(result){
            User.findByIdAndUpdate(req.user._id,{
                $push:{teachingClasses:result._id}
            },{new:true})
            .exec((err,result)=>{
                if(err)
                    return res.status(422).json({error:err})
            })
            res.json({message:"Class added"})
        }
        else{
            return res.json({error:"Error adding class"})
        }
    }).catch(err=>console.log(err));
});

router.post('/editclass',requireLogin,(req,res)=>{
    const {id,name,subject,fromTime,toTime,daysOfClass} = req.body;
    ClassRoom.findOne({id:id}).then((classRoom)=>{
        console.log(classRoom);
        classRoom.name=name;
        classRoom.subject=subject;
        classRoom.fromTime=fromTime;
        classRoom.toTime=toTime;
        classRoom.daysOfClass=daysOfClass;
        classRoom.save().then((result)=>{
            if(result){
                res.json({message:"Class updated"})
            }
            else{
                return res.json({error:"Error adding class"})
            }
        }).catch(err=>console.log(err)); 
    })    
});

router.delete('/deleteclass/:classId',requireLogin,(req,res)=>{
    User.updateMany({attendingClasses:req.params.classId},{$pull:{attendingClasses:req.params.classId}}).then((result)=>{
        console.log(result);
    })
    ClassRoom.findOne({_id:req.params.classId}).then((classRoom)=>{
        classRoom.remove().then(result=>{
            res.json({message:"Deleted successfully"});
        }).catch(err=>console.log(err));
    })

})

router.get('/getclasses',requireLogin,(req,res)=>{
    const user=req.user;
    if(user.usertype=="Student"){
        let classes=[];
        const promises = user.attendingClasses.map(async classOne=>{
            const response=await ClassRoom.findById(classOne).then(classdata=>{
                classes.push(classdata);
            })
            return classes;
        })
        Promise.all(promises).then(()=>{return res.json({classes})});
    }
    else{
        let classes=[];
        const promises = user.teachingClasses.map(async classOne=>{
            const response=await ClassRoom.findById(classOne).then(classdata=>{
                classes.push(classdata);
            })
            return classes;
        })
        Promise.all(promises).then(()=>{return res.json({classes})});
    }
})

router.get('/getclass/:classId',requireLogin,(req,res)=>{
    ClassRoom.findById(req.params.classId).then(classData=>{
        if(classData){
            res.json({class:classData});
        }
        else{
            return res.status(422).json({error:"Can't find any class"})
        }
    }).catch(err=>console.log(err));
})

router.get('/getCountOfStudents/:classId',requireLogin,(req,res)=>{
    User.countDocuments({attendingClasses:req.params.classId},(err,result)=>{
        if(err) console.log(err);
        res.json({count:result});
    })
})

router.get('/getStudents',requireLogin,(req,res)=>{
    User.find({usertype:"Student"}).then(result=>{
        res.json({students:result})
    })
})

router.post('/addstudents',requireLogin,(req,res)=>{
    const {studentsArray,profileId} = req.body;
    studentsArray.map(student=>{
        User.findByIdAndUpdate(student,{
            $push:{attendingClasses:profileId}
        },{new:true},(err,result)=>{
            if(err) console.log(err);
        })
    })
    res.json({message:"Success"})
})


module.exports = router;