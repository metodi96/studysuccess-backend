//we need the express router and to require the model
const router = require('express').Router();
const TutorsController = require('../controllers/tutors');

//get all tutors
router.get('/', TutorsController.tutors_get_all);
router.put('/:tutorId/timePreferences', TutorsController.tutors_add_time_prefs);
router.get('/:tutorId/timePreferences', TutorsController.tutors_get_time_prefs);
router.get('/:subjectId', TutorsController.tutors_get_for_subject);
router.get('/:subjectId/filtered', TutorsController.tutors_get_filtered);


/**router.route('/filter').get((req, res) => {
  User.find({
    hasCertificateOfEnrolment: true,
    hasGradeExcerpt: true
    })
    .populate('subjectsToTakeLessonsIn')
    .populate('subjectsToTeach')
    .find({subjectsToTakeLessonsIn: req.body.subject})
    .find({languages: req.body.languages})
    .where('pricePerHour').lte(req.body.pricePerHour);
});*/

//get a specific tutor
/**router.get('/:id', TutorsController.tutors_get_one);
router.route('/:subjectId/:id').get((req, res) => {
  User.find({
    hasCertificateOfEnrolment: true,
    hasGradeExcerpt: true
    })
    .populate('subjectsToTakeLessonsIn')
    .populate('subjectsToTeach')
    .findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
}); */

module.exports = router;