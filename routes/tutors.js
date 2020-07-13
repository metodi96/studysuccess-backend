const checkAuth = require('../middleware/check-auth');
//we need the express router and to require the model
const router = require('express').Router();
const TutorsController = require('../controllers/tutors');

//get all tutors
router.get('/', TutorsController.tutors_get_all);
router.post('/:tutorId/timePreferences', TutorsController.timepreferences_add);
router.get('/:tutorId/timePreferences', TutorsController.timepreferences_get_all_of_tutor);
router.get('/:subjectId', TutorsController.tutors_get_for_subject);
router.get('/:subjectId/:tutorId', TutorsController.tutors_get_one_for_subject);
router.get('/:subjectId/filtered', checkAuth, TutorsController.tutors_get_filtered);
router.get('/:subjectId/filtered/:tutorId', checkAuth, TutorsController.tutors_get_one);
router.post('/addToFavourites', TutorsController.favourite_add);

module.exports = router;