let Booking = require('../models/booking');
let User = require('../models/user');
let TimePreference = require('../models/preference');
let Invitation = require('../models/invitation');
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
    const tutorId = req.body.tutorId;
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
                            User.updateOne({ _id: tutorId }, { $addToSet: { feedback: { rating: req.body.rating, comment: req.body.comment, forSubject: req.body.forSubject } } }, { new: true })
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
    Booking.find({ user: req.userData.userId, acceptedByTutor: true, paid: true }).where('timeslotStart').gt(new Date())
        .populate('tutor')
        .populate('subject')
        .then(booking => res.json(booking))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_delete_one = (req, res) => {
    Booking.find({ user: req.userData.userId })
        .then(
            Booking.findByIdAndDelete(req.params.id)
                .then(() =>
                    TimePreference.updateOne({ _id: req.body.timePreferenceId }, { $pull: { bookedOnWeeks: req.body.week } })
                        .then(() => {
                            res.json('Booking removed successfully and week value removed from bookedOnWeeks array')
                        })
                        .catch(err => {
                            console.log('sth went wrong')
                            res.status(400).json('Error: ' + err)
                        }))
                .catch(err => res.status(400).json('Error: ' + err)))
        .catch(err => res.status(400).json('Error: ' + err))
}

exports.bookings_current_invite = (req, res) => {
    const fromUser = req.userData.userId;
    const booking = req.body.bookingId;
    const friendEmail = req.body.friendEmail;
    User.findOne({ email: friendEmail })
        .then(user => {
            const newInvitation = new Invitation({ fromUser, toUser: user._id, booking })
            newInvitation
                .save()
                .then(() =>
                    Booking.updateOne({ _id: booking }, { $inc: { participantNumber: 1 } })
                        .then(() => {
                            res.json('Invitation created and participant number of booking incremented by 1');
                        })
                        .catch(err => res.status(400).json('Error with incrementing participant number broski: ' + err))
                )
                .catch(err => {
                    console.log('Could not save invitation :(')
                    res.status(400).json('Error: ' + err)
                })
        })
        .catch(err => {
            res.status(400).json('Error with finding user by email: ' + err)
        });
}

exports.bookings_current_get_invitations = (req, res) => {
    Invitation.find({ booking: req.params.id })
        .populate('toUser')
        .then(invitations => res.json(invitations))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_get_pending_invitations = (req, res) => {
    Invitation.find({ toUser: req.userData.userId, accepted: false })
        .populate({
            path: 'booking',
            populate: {
                path: 'tutor'
            }
        })
        .populate('fromUser')
        .then(invitations => res.json(invitations))
        .catch(err => res.status(400).json('Error: ' + err))
}

exports.bookings_get_accepted_invitations = (req, res) => {
    Invitation.find({ toUser: req.userData.userId, accepted: true })
        .populate({
            path: 'booking',
            populate: {
                path: 'tutor'
            },
            match: { timeslotStart: { $gt: new Date() }}
        })
        .populate('fromUser')
        .then(invitations => res.json(invitations))
        .catch(err => res.status(400).json('Error: ' + err))
}

//isnt yet included in routes
exports.bookings_accept_pending_invitation = (req, res) => {
    Invitation.updateOne({ _id: req.params.invitationId, toUser: req.userData.userId }, { $set: { accepted: true } }, { new: true })
        .then(invitation => res.json(`Invitation accepted: ${invitation}`))
        .catch(err => res.status(400).json('Error: ' + err))
}

exports.bookings_current_remove_invitation = (req, res) => {
    Invitation.findByIdAndDelete({ _id: req.params.invitationId })
        .then(
            Booking.updateOne({ _id: req.params.id }, { $inc: { participantNumber: -1 } })
                .then(() => res.json('Invitation deleted and participant number of the booking decremented by 1.'))
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
            "return_url": `http://localhost:3000/bookings/success?timeslotStart=${req.body.timeslotStart}&timeslotEnd=${req.body.timeslotEnd}&participantNumber=${req.body.participantNumber}&tutor=${req.body.tutor}&price=${req.body.price}&subject=${req.body.subject}&timePreferenceId=${req.body.timePreferenceId}&week=${req.body.week}`,
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
            "description": `${req.body.price} EUR for a tutorial with ${req.body.firstname} ${req.body.lastname}.`
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
                "total": req.query.price
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
            const week = req.query.week;
            const paid = true;
            const acceptedByTutor = true;
            const newBooking = new Booking({ timeslotStart, timeslotEnd, participantNumber, week, timePreferenceId, user, tutor, subject, acceptedByTutor, paid });

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

exports.bookings_add_proposed_time = (req, res) => {
    const timeslotStart = req.body.timeslotStart;
    const timeslotEnd = req.body.timeslotEnd;
    const participantNumber = req.body.participantNumber;
    const user = req.userData.userId;
    const tutor = req.body.tutor;
    const subject = req.body.subject;
    const newBooking = new Booking({ timeslotStart, timeslotEnd, participantNumber, user, tutor, subject });

    newBooking.save()
        .then(() => res.status(200).json(`Booking added to the view of the tutor (not paid and not accepted)`))
        .catch(err => console.log(err));
}

//isn't yet included in routes
exports.bookings_get_all_current_not_accepted_and_not_paid_for_tutor = (req, res) => {
    Booking.find({ tutor: req.userData.userId, acceptedByTutor: false, paid: false }).where('timeslotStart').gt(new Date())
        .populate('tutor')
        .populate('user')
        .populate('subject')
        .then(booking => res.json(booking))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_get_all_current_not_paid_for_user = (req, res) => {
    Booking.find({ user: req.userData.userId, paid: false }).where('timeslotStart').gt(new Date())
        .populate('tutor')
        .populate('user')
        .populate('subject')
        .then(booking => res.json(booking))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_accept_proposed_time = (req, res) => {
    Booking.updateOne({ _id: req.params.id, tutor: req.userData.userId }, { $set: { acceptedByTutor: true } })
        .then(booking => res.json(`Proposed time accepted by tutor. Booking is: ${booking}`))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.bookings_pay_accepted_proposed_time = (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:3000/bookings/successAccepted?timeslotStart=${req.body.timeslotStart}&timeslotEnd=${req.body.timeslotEnd}&participantNumber=${req.body.participantNumber}&tutor=${req.body.tutor}&price=${req.body.price}&subject=${req.body.subject}&bookingId=${req.body.bookingId}`,
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
            "description": `${req.body.price} EUR for a tutorial with ${req.body.firstname} ${req.body.lastname}.`
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

exports.bookings_pay_accepted_proposed_time_success = (req, res) => {

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": req.query.price
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));


            Booking.updateOne({ _id: req.query.bookingId, user: req.userData.userId }, { $set: { acceptedByTutor: true, paid: true } })
                .then(booking => res.json(`Booking with proposed time is paid: ${booking}`))
                .catch(err => res.status(400).json('Error: ' + err));
        }
    })
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