//we need the express router and to require the model
const router = require('express').Router();
let User = require('../models/user');

//the first endpoint /users
router.route('/').get((req, res) => {
    //get a list of all the users from the mongodb database 
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get a specific user
router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//update a user 
router.route('/:id/update').post((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.dateOfBirth = req.body.dateOfBirth;
      user.semester = req.body.semester;
      user.university = req.body.university;
      user.studyProgram = req.body.studyProgram;
      user.degree = req.body.degree;
      user.certificateOfEnrolment = req.body.certificateOfEnrolment;
      user.gradeExcerpt = req.body.gradeExcerpt;

      user.save()
        .then(() => user.certificateOfEnrolment && user.gradeExcerpt ? res.json('User updated to tutor!') : res.json('User updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

//this handles incoming http post requests
//users/add
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