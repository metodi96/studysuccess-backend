//we need the express router and to require the model
const router = require('express').Router();
const TutorsController = require('../controllers/tutors');

//get all tutors
router.get('/', TutorsController.tutors_get_all);

//get a specific tutor
router.get('/:id', TutorsController.tutors_get_one);

module.exports = router;