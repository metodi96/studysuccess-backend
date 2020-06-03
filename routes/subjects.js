//we need the express router and to require the model
const router = require('express').Router();
let Subject = require('../models/subject');

//the first endpoint /subjects
router.route('/').get((req, res) => {
    //get a list of all the subjects from the mongodb database 
    //return a promise
  Subject.find()
    .then(subjects => res.json(subjects))
    .catch(err => res.status(400).json('Error: ' + err));
});

//this handles incoming http post requests
router.route('/add').post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  const newSubject = new Subject({name, description});

  newSubject.save()
    .then(() => res.json('Subject added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get a specific subject
router.route('/:id').get((req, res) => {
    Subject.findById(req.params.id)
    
      .then(subject => res.json(subject))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  
 //delete a specific subject 
  router.route('/:id').delete((req, res) => {
    Subject.findByIdAndDelete(req.params.id)
      .then(() => res.json('Subject deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });

  module.exports = router;