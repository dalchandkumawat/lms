const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGOURI = 'mongodb+srv://dalchand:kumawatdal@learningmanagementsyste.kkbos.mongodb.net/LearningManagementSystem?retryWrites=true&w=majority';
const PORT= process.env.PORT || 5000;

app.use(express.json());
require('./models/user');
require('./models/classroom');
app.use(require('./routes/auth'));
app.use(require('./routes/class'));

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log("Error connecting: ", err);
})
process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error);
});

//To use client build folder in production
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () => {
    console.log("Listening at ",PORT);
});
