let User = require('../models/user');

exports.tutors_get_all = (req, res) => {
    //get a list of all the tutors from the mongodb database 
    User.find({
        hasCertificateOfEnrolment: true,
        hasGradeExcerpt: true
    })
        .populate('subjectsToTakeLessonsIn')
        .populate('subjectsToTeach')
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.tutors_get_one = (req, res) => {
    User.find({
        hasCertificateOfEnrolment: true,
        hasGradeExcerpt: true
    })
        .populate('subjectsToTakeLessonsIn')
        .populate('subjectsToTeach')
        .findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.tutors_add_time_prefs = (req, res) => {
    const tutorId = req.params.tutorId;
    User.findById(tutorId)    
        .then(User.updateOne({ _id: tutorId},
             { $addToSet: { timePreferences: { day: req.body.day, startTime: req.body.startTime, endTime: req.body.endTime} } },
              { new: true })
              .then(() => res.json("Tutor time preferences updated!"))
              .catch(err => res.status(400).json('Error: ' + err)))
                .catch(err => res.status(400).json('Error: ' + err));
}

exports.tutors_get_time_prefs = (req, res) => {
    User.findById(req.params.tutorId)
    .then(tutor => res.json(tutor.timePreferences))
    .catch(err => res.status(400).json('Error: ' + err));
}

exports.tutors_get_for_subject = (req, res) => {
    User.find({
    hasCertificateOfEnrolment: true,
    hasGradeExcerpt: true
    })
    .populate('subjectsToTakeLessonsIn')
    .populate('subjectsToTeach')
    .find({'subjectsToTeach' :  req.params.subjectId})
    .then(tutor => res.json(tutor))
    .catch(err => res.status(400).json('Error: ' + err))
}

exports.tutors_get_filtered = (req, res) => {
    User.find({
        hasCertificateOfEnrolment: true,
        hasGradeExcerpt: true
        })
        .populate('subjectsToTakeLessonsIn')
        .populate('subjectsToTeach')
        .find({'languages': req.body.language})
        .where('pricePerHour').lte(req.body.pricePerHour)
        .then(tutor => res.json(tutor))
        .catch(err => res.status(400).json('Error: ' + err));
}


