//we need the express router and to require the model
const router = require('express').Router();
let User = require('../models/user');

//get all tutors
router.get('/', (req, res) => {
  //get a list of all the tutors from the mongodb database 
  User.find({
    hasCertificateOfEnrolment: true,
    hasGradeExcerpt: true
  })
    .populate('subjectsToTakeLessonsIn')
    .populate('subjectsToTeach')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get a specific tutor
router.get('/:id', (req, res) => {
  User.find({
    hasCertificateOfEnrolment: true,
    hasGradeExcerpt: true
  })
    .populate('subjectsToTakeLessonsIn')
    .populate('subjectsToTeach')
    .findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;