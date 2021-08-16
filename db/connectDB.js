const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@flash.ku6yq.mongodb.net/flashretryWrites=true&w=majority`;
// Create database connection
function connectDB() {
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:  false,   
        useCreateIndex: true
    }, (err) => {
        if (err) {
            console.log(err);
        } else {console.log('Database Connected...')}
    })
}


module.exports = connectDB;