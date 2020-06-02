//we need the express router and to require the model
const router = require('express').Router();
let User = require('../models/user');

//the first endpoint /tutors
router.route('/').get((req, res) => {
    //get a list of all the tutors from the mongodb database 
  User.find({
      certificateOfEnrolment: true,
      gradeExcerpt: true
  })
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get a specific tutor
router.route('/:id').get((req, res) => {
  User.find({
    certificateOfEnrolment: true,
    gradeExcerpt: true
    }).findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;