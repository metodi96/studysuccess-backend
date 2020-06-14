const checkAuth = require('../middleware/check-auth');
//we need the express router and to require the model
const router = require('express').Router();
const TutorsController = require('../controllers/tutors');

//get all tutors
router.get('/', TutorsController.tutors_get_all);
router.put('/:tutorId/timePreferences', TutorsController.tutors_add_time_prefs);
router.get('/:tutorId/timePreferences', TutorsController.tutors_get_time_prefs);
router.get('/:subjectId', TutorsController.tutors_get_for_subject);
router.get('/:subjectId/filtered', checkAuth, TutorsController.tutors_get_filtered);
router.get('/:subjectId/filtered/:tutorId', checkAuth, TutorsController.tutors_get_one);

module.exports = router;