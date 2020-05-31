//we need the express router and to require the model
const router = require('express').Router();
let User = require('../models/user');

//the first endpoint /users
router.route('/').get((req, res) => {
    //get a list of all the users from the mongodb database 
    //return a promise
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//this handles incoming http post requests
router.route('/add').post((req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const dateOfBirth = req.body.dateOfBirth;
  const semester = req.body.semester;
  const university = req.body.university;
  const studyProgram = req.body.studyProgram;
  const degree = req.body.degree;
 

  const newUser = new User({firstname, lastname, email, dateOfBirth, semester, university, studyProgram, degree});

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;