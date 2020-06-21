"use strict";
const mongoose = require('mongoose');

// define the subject schema
const TimePreferenceSchema = new mongoose.Schema({
    tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    day: Number,
    startTime: {
        hours: String,
        minutes: String
    },
    endTime: {
        hours: String,
        minutes: String
    },
    bookedOnWeeks: [Number],
}, {
    timestamps: true,
});

TimePreferenceSchema.set('versionKey', false);

// export the time preference model
module.exports = mongoose.model('TimePreference', TimePreferenceSchema);