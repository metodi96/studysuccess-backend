"use strict";
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: false
    },
    comment: {
        type: String,
        default: "",
        required: false
    },
    booking: {type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true}
});

FeedbackSchema.set('versionKey', false);

// export the booking model
module.exports = mongoose.model('Feedback', FeedbackSchema);