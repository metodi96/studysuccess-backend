"use strict";
const mongoose = require('mongoose');

// define the booking schema
const BookingSchema  = new mongoose.Schema({
    timeslotStart: {type: Date}, 
    timeslotEnd: {type: Date},
    participantNumber: {type: Number},
    tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    feedback: {
        rating: {
            type: Number,
            default: 0
        },
        comment: {
            type: String,
            default: ""
        }
    }
},  {
        timestamps: true,
});

BookingSchema.set('versionKey', false);

// export the booking model
module.exports = mongoose.model('Booking', BookingSchema);