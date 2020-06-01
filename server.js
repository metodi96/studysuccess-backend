const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//environment variables in dotenv file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//cors middleware
app.use(cors());
//this will allow us to parse json
app.use(express.json());

//our database uri - something that we'll have to get from mongodb dashboard
const uri = process.env.ATLAS_URI;
//start connection
console.log("Attempting database connection...")
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.get('/', (req, res) => {
  res.send("")
})
//require the routes and use them
//users router
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
//tutors router
const tutorsRouter = require('./routes/tutors');
app.use('/tutors', tutorsRouter);
//bookings router
const bookingsRouter = require('./routes/bookings');
app.use('/bookings', bookingsRouter);

//server is listening on port...
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});