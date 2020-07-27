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

app.listen(PORT, () => {
    console.log("Listening at ",PORT);
});