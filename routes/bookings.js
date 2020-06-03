//we need the express router and to require the model
const router = require('express').Router();
let Booking = require('../models/booking');
let User = require('../models/user');

//the first endpoint /bookings
router.route('/').get((req, res) => {
    //get a list of all the bookings from the mongodb database 
    //return a promise
  Booking.find()
    .populate('tutor')
    .populate('subject')
    .then(bookings => res.json(bookings))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get past bookings
router.route('/past').get((req, res) => {
  Booking.find().where('timeslotStart').lt(new Date()).
  populate('tutor').
  then(booking => res.json(booking)).
  catch(err => res.status(400).json('Error: ' + err)); 
});

//get a specific past booking
router.route('/past/:id').get((req, res) => {
  Booking.findById(req.params.id).where('timeslotStart').lt(new Date()).
  populate('tutor').
  then(booking => res.json(booking)).
  catch(err => res.status(400).json('Error: ' + err)); 
});


//post feedback to a specific past booking and update booking and tutor entries with it
router.route('/past/:id/feedback/add').post((req, res) => {
  const booking = req.params.id;
  const tutor = req.body.tutor;
  Booking.findById(booking).then(booking => {
    //check if for this booking feedback is given
    if(!booking.feedbackGiven) {
      Booking.updateOne({_id: booking}, {$set: {feedbackGiven: true}}, {new: true})
      .where('timeslotStart')
      .lt(new Date())
      .then(
        User.updateOne({_id: tutor}, {$addToSet: {feedback: {rating: req.body.rating, comment: req.body.comment}}}, {new: true})
        .then(() => res.json("User and booking updated with feedback")))
        .catch(err => res.status(400).json('Error: ' + err));
    } else {
      res.json('Feedback already given for this booking')
    }
  })
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/current').get((req, res) => {
  Booking.find().where('timeslotStart').gt(new Date()).
  populate('tutor').
  then(booking => res.json(booking)).
  catch(err => res.status(400).json('Error: ' + err)); 
});

//post a booking
router.route('/add').post((req, res) => {
  const timeslotStart = req.body.timeslotStart;
  const timeslotEnd = req.body.timeslotEnd;
  const participantNumber = req.body.participantNumber;
  const tutor = req.body.tutor;
  const subject = req.body.subject;

  const newBooking = new Booking({timeslotStart, timeslotEnd, participantNumber, tutor, subject});

  newBooking.save()
    .then(() => res.json('Booking added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get a specific booking
router.route('/:id').get((req, res) => {
    Booking.findById(req.params.id)
    .populate('tutor')
    .populate('subject')
      .then(booking => res.json(booking))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  
  //delete a specific booking
  router.route('/:id').delete((req, res) => {
    Booking.findByIdAndDelete(req.params.id)
      .then(() => res.json('Booking deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });

  //to be revisited
  router.route('/:tutorId/feedback').get((req, res) => {
    Booking.find().
    populate('tutor').
    where('tutor._id').equals(req.params.tutorId.toString).
    then(bookings => res.json(bookings.map(x => x.feedback))).
    catch(err => res.status(400).json('Error: ' + err));
  });

  /* initial logic - to be discussed
  router.route('/update/:id').post((req, res) => {
    Booking.findById(req.params.id)
      .then(booking => {
        booking.timeslotStart = req.body.timeslotStart;
        booking.timeslotEnd = req.body.timeslotEnd;
        booking.participantNumber = req.body.participantNumber;
  
        booking.save()
          .then(() => res.json('Booking updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });*/

module.exports = router;