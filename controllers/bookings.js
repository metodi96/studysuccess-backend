let Booking = require('../models/booking');
let User = require('../models/user');
let TimePreference = require('../models/preference');
const paypal = require('paypal-rest-sdk');

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
        populate('subject').
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
        .populate('subject')
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

exports.bookings_pay = (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:3000/bookings/success?timeslotStart=${req.body.timeslotStart}&timeslotEnd=${req.body.timeslotEnd}&participantNumber=${req.body.participantNumber}&tutor=${req.body.tutor}&subject=${req.body.subject}&timePreferenceId=${req.body.timePreferenceId}&week=${req.body.week}`,
            "cancel_url": "http://localhost:3000/bookings/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": req.body.firstname,
                    "sku": "001",
                    "price": req.body.price,
                    "currency": "EUR",
                    "quantity": 1,
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": req.body.price
            },
            "description": `${req.body.timeslotStart} EUR for a tutorial with ${req.body.firstname} ${req.body.lastname}.`
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            payment.links.forEach(paymentLink => {
                if (paymentLink.rel === 'approval_url') {
                    res.json({ forwardLink: `${paymentLink.href}` });
                }
            });
        }
    });
}

exports.bookings_add_success = (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": "30"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            const timeslotStart = req.query.timeslotStart;
            const timeslotEnd = req.query.timeslotEnd;
            const participantNumber = req.query.participantNumber;
            const user = req.userData.userId;
            const tutor = req.query.tutor;
            const subject = req.query.subject;
            const timePreferenceId = req.query.timePreferenceId;
            const newBooking = new Booking({ timeslotStart, timeslotEnd, participantNumber, user, tutor, subject });

            newBooking.save()
                .then((booking) => {
                    TimePreference.updateOne({ tutor: tutor, _id: timePreferenceId }, { $addToSet: { bookedOnWeeks: req.query.week } }, { new: true })
                        .then(() => res.status(200).json(`Booking added successfully and time preference busy status updated: ${booking}`))
                        .catch(err => res.status(400).json('Error with updating user status: ' + err))
                })
                .catch(err => console.log(err));
        }
    });
}

exports.bookings_add_cancel = (req, res) => {
    res.status(200).json('Transaction cancelled.')
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