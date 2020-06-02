"use strict";
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: false
    },
    comment: {
        type: String,
        default: " ",
        required: false
    }
});

FeedbackSchema.set('versionKey', false);

// export the booking model
module.exports = mongoose.model('Feedback', FeedbackSchema);