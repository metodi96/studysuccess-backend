"use strict";
const mongoose = require('mongoose');

// define the subject schema
const InvitationSchema = new mongoose.Schema({
    fromUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    toUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    booking: {type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true}
}, {
    timestamps: true,
});

InvitationSchema.set('versionKey', false);

// export the time preference model
module.exports = mongoose.model('Invitation', InvitationSchema);