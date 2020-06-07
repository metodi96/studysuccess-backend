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