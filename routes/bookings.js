//we need the express router and to require the model
const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');
const BookingsController = require('../controllers/bookings');

//get a list of all the bookings from the mongodb database of the logged in user
router.get('/', checkAuth, BookingsController.bookings_get_all);

//post a booking
router.post('/add', checkAuth, BookingsController.bookings_add);

//get past bookings of the logged in user
router.get('/past', checkAuth, BookingsController.bookings_get_all_past);

//get the current bookings of the logged in user
router.get('/current', checkAuth, BookingsController.bookings_get_all_current);

//delete a specific current booking
router.delete('/current/:id/cancel', checkAuth, BookingsController.bookings_delete_one);

//get a specific booking of the logged in user
router.get('/:id', checkAuth, BookingsController.bookings_get_one);

//get a specific past booking of the logged in user
router.get('/past/:id', checkAuth, BookingsController.bookings_get_one_past);

//post feedback to a specific past booking and update booking and tutor entries with it
router.post('/past/:id/feedback/add', checkAuth, BookingsController.bookings_add_feedback);

/* initial logic - to be discussed
router.post('/update/:id', checkAuth, BookingsController.bookings_update_one);*/

module.exports = router;