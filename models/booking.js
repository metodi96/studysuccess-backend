"use strict";
const mongoose = require('mongoose');

// define the booking schema
const BookingSchema  = new mongoose.Schema({
    timeslotStart: {type: Date}, 
    timeslotEnd: {type: Date},
    participantNumber: {type: Number},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true},
    feedbackGiven: {type: Boolean, default: false}
},  {
        timestamps: true,
});

BookingSchema.set('versionKey', false);

// export the booking model
module.exports = mongoose.model('Booking', BookingSchema);