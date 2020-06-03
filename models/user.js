"use strict";
const mongoose = require('mongoose');
//require the new package for type Email
require('mongoose-type-email');

// define the user schema
const UserSchema  = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        unique: false,
        minlength: 1,
    },
    lastname: {
        type: String,
        required: true,
        minlength: 1,
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    semester: {
        type: Number,
        required: false,
        minlength: 1,
    },
    university: {
        type: String,
        enum: ['TUM', 'LMU'],
        default: 'TUM'
    },
    studyProgram: {
        type: String,
        enum: ['Informatics', 'Information Systems', 'BWL', 'Bioinformatics'],
        default: 'Information Systems'
    },
    degree: {
        type: String,
        enum: ['Bachelor', 'Master'],
        default: 'Bachelor'
    },
    avgRating: {
        type: Number
    },
    certificateOfEnrolment: {
        type: Boolean
    },
    gradeExcerpt: {
        type: Boolean
    },
    pricePerHour: {
        type: Number
    },
    personalStatement: {
        type: String
    },
    languages: {type: [String], select: false},
    feedback: [{
        rating: {
        type: Number,
        required: false
    },
    comment: {
        type: String,
        default: "",
        required: false
    }
    }]
},  {
        timestamps: true,
});

UserSchema.set('versionKey', false);

// export the user model
module.exports = mongoose.model('User', UserSchema);