//we need the express router and to require the model
const router = require('express').Router();
let Booking = require('../models/booking');

//the first endpoint /bookings
router.route('/').get((req, res) => {
    //get a list of all the bookings from the mongodb database 
    //return a promise
  Booking.find()
    .populate('tutor')
    .then(bookings => res.json(bookings))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/past').get((req, res) => {
  Booking.find().where('timeslotStart').lt(new Date()).
  populate('tutor').
  then(booking => res.json(booking)).
  catch(err => res.status(400).json('Error: ' + err)); 
});

router.route('/current').get((req, res) => {
  Booking.find().where('timeslotStart').gt(new Date()).
  populate('tutor').
  then(booking => res.json(booking)).
  catch(err => res.status(400).json('Error: ' + err)); 
});

//this handles incoming http post requests
router.route('/add').post((req, res) => {
  const timeslotStart = req.body.timeslotStart;
  const timeslotEnd = req.body.timeslotEnd;
  const participantNumber = req.body.participantNumber;
  const tutor = req.body.tutor;

  const newBooking = new Booking({timeslotStart, timeslotEnd, participantNumber, tutor});

  newBooking.save()
    .then(() => res.json('Booking added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get a specific booking
router.route('/:id').get((req, res) => {
    Booking.findById(req.params.id)
    .populate('tutor')
      .then(booking => res.json(booking))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  
  router.route('/:id').delete((req, res) => {
    Booking.findByIdAndDelete(req.params.id)
      .then(() => res.json('Booking deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });

  router.route('/:id/feedback').get((req, res) => {
    Booking.find().
    populate('tutor').
    where('tutor._id').equals(req.params.id.toString).
    then(booking => res.json(booking[0].feedback)).
    catch(err => res.status(400).json('Error: ' + err));
    console.log(req.params.id); 
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