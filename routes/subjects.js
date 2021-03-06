//we need the express router
const router = require('express').Router();
const SubjectsController = require('../controllers/subjects');

//get all the subjects
router.get('/', SubjectsController.subjects_get_all);

//add a subject
router.post('/add', SubjectsController.subjects_add);

//get a specific subject
router.get('/:id', SubjectsController.subjects_get_one);

//delete a specific subject 
router.delete('/:id', SubjectsController.subjects_delete_one);

module.exports = router;