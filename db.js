// const mongoose = require('mongoose')
// const mongooseURl = 'mongodb://127.0.0.1/'
// // const mongooseURl = 'mongodb://localhost:27017'
// const connectToMongo =()=>{
//     mongoose.connect(mongooseURl)
//     console.log('connected succesfully')
// }

// module.exports = connectToMongo;


const mongoose = require('mongoose');
require('dotenv').config();


const mongooseURl = process.env.DATABASE_URL;

const connectToMongo = () => {
    mongoose.connect(mongooseURl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully!');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });
}

module.exports = connectToMongo;
