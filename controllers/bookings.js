let Booking = require('../models/booking');
let User = require('../models/user');

exports.bookings_get_all = (req, res) => {
    Booking.find({ user: req.userData.userId })
        .populate('tutor')
        .populate('subject')
        .then(bookings => res.json(bookings))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_get_all_past = (req, res) => {
    Booking.find({ user: req.userData.userId }).where('timeslotStart').lt(new Date()).
        populate('tutor').
        then(booking => res.json(booking)).
        catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_get_one_past = (req, res) => {
    Booking.find({ user: req.userData.userId })
        .then(
            Booking.findById(req.params.id).where('timeslotStart').lt(new Date())
                .populate('tutor')
                .then(booking => res.json(booking))
                .catch(err => res.status(400).json('Error: ' + err)))
        .catch(err => res.status(400).json('Error: ' + err));

}

exports.bookings_add_feedback = (req, res) => {
    const booking = req.params.id;
    const tutor = req.body.tutor;
    //first find all the bookings of the logged in user
    Booking.find({ user: req.userData.userId })
        .then(
            //find the one from the url params id
            Booking.findById(booking).then(booking => {
                //check if for this booking feedback is given
                if (!booking.feedbackGiven) {
                    Booking.updateOne({ _id: booking }, { $set: { feedbackGiven: true } }, { new: true })
                        .where('timeslotStart')
                        .lt(new Date())
                        .then(
                            User.updateOne({ _id: tutor }, { $addToSet: { feedback: { rating: req.body.rating, comment: req.body.comment } } }, { new: true })
                                .then(() => res.json("User and booking updated with feedback")))
                        .catch(err => res.status(400).json('Error: ' + err));
                } else {
                    res.json('Feedback already given for this booking')
                }
            })
                .catch(err => res.status(400).json('Error: ' + err)))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_get_all_current = (req, res) => {
    Booking.find({ user: req.userData.userId }).where('timeslotStart').gt(new Date())
        .populate('tutor')
        .then(booking => res.json(booking))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_delete_one = (req, res) => {
    Booking.find({ user: req.userData.userId })
        .then(
            Booking.findByIdAndDelete(req.params.id).where('timeslotStart').gt(new Date())
                .then(() => res.json('Booking deleted.'))
                .catch(err => res.status(400).json('Error: ' + err)))
        .catch(err => res.status(400).json('Error: ' + err))
}

exports.bookings_add = (req, res) => {
    const timeslotStart = req.body.timeslotStart;
    const timeslotEnd = req.body.timeslotEnd;
    const participantNumber = req.body.participantNumber;
    const user = req.userData.userId;
    const tutor = req.body.tutor;
    const subject = req.body.subject;

    const newBooking = new Booking({ timeslotStart, timeslotEnd, participantNumber, user, tutor, subject });

    newBooking.save()
        .then(() => res.json('Booking added!'))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_get_one = (req, res) => {
    Booking.find({ user: req.userData.userId })
        .then(
            Booking.findById(req.params.id)
                .populate('tutor')
                .populate('subject')
                .then(booking => res.json(booking))
                .catch(err => res.status(400).json('Error: ' + err)))
        .catch(err => res.status(400).json('Error: ' + err));
}

/* to be updated
exports.bookings_update_one = (req, res) => {
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
  }
  */