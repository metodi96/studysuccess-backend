"use strict";
const mongoose = require('mongoose');
//require the new package for type Email
require('mongoose-type-email');

// define the user schema
const UserSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
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
    subjectsToTakeLessonsIn: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }] },
    avgRating: {
        type: Number,
        default: function () {
            if (this.hasCertificateOfEnrolment && this.hasGradeExcerpt && this.feedback != undefined) {
                var totalRating = 0;
                for (const { rating } of this.feedback) {
                    totalRating += rating;
                }
                return totalRating / this.feedback.length
            } else {
                undefined
            }
        }
    },
    hasCertificateOfEnrolment: {
        type: Boolean
    },
    hasGradeExcerpt: {
        type: Boolean
    },
    pricePerHour: {
        type: Number,
        default: undefined
    },
    personalStatement: {
        type: String,
        default: undefined
    },
    languages: { type: [String], default: undefined },
    subjectsToTeach: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], default: undefined },
    feedback: {
        type: [{
            rating: {
                type: Number,
                required: false
            },
            comment: {
                type: String,
                default: "",
                required: false
            }
        }], default: undefined
    },
    userImage: { type: String }
}, {
    timestamps: true,
});

UserSchema.set('versionKey', false);

// export the user model
module.exports = mongoose.model('User', UserSchema);