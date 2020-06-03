"use strict";
const mongoose = require('mongoose');

// define the subject schema
const SubjectSchema  = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: false,
      minlength: 1,
    }, 
    description: {type: String}
},  {
        timestamps: true,
});

SubjectSchema.set('versionKey', false);

// export the subject model
module.exports = mongoose.model('Subject', SubjectSchema);