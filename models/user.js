"use strict";
const mongoose = require('mongoose');

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
        type: String,
        required: true,
        minlength: 5
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
    }
    
},  {
        timestamps: true,
});

UserSchema.set('versionKey', false);

// export the user model
module.exports = mongoose.model('User', UserSchema);