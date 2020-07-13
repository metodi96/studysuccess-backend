let User = require('../models/user');

exports.tutors_get_all = (req, res) => {
    //get a list of all the tutors from the mongodb database 
    console.log("all tutors")
    User.find({
        hasCertificateOfEnrolment: true,
        hasGradeExcerpt: true
    })
        .populate({
            path: 'subjectstoteach',
            populate: {path : 'subjectstoteach'}
            })
        .populate('timePreferences')
        .then(users => {console.log(users);res.json(users)} )
        .catch(err => {console.log(err);(res.status(400).json('Error: ' + err))});
}

exports.tutors_get_one = (req, res) => {
    User.find({
        hasCertificateOfEnrolment: true,
        hasGradeExcerpt: true,
        _id: req.params.tutorId
    })
        .populate('subjectsToTakeLessonsIn')
        .populate('subjectsToTeach')
        .populate('timePreferences')
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.tutors_get_for_subject = (req, res) => {
    User.find({
        hasCertificateOfEnrolment: true,
        hasGradeExcerpt: true
    })
        .populate('subjectsToTakeLessonsIn')
        .populate('subjectsToTeach')
        .populate('timePreferences')
        .find({ 'subjectsToTeach': req.params.subjectId })
        .then(tutor => res.json(tutor))
        .catch(err => res.status(400).json('Error: ' + err))
}

exports.tutors_get_one_for_subject = (req, res) => {
    User.find({
        hasCertificateOfEnrolment: true,
        hasGradeExcerpt: true
    })
        .populate('subjectsToTakeLessonsIn')
        .populate('subjectsToTeach')
        .populate('feedback.forSubject')
        .populate('timePreferences')
        .find({ 'subjectsToTeach': req.params.subjectId })
        .findOne({ _id: req.params.tutorId })
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
        .populate('timePreferences')
        .find({ 'languages': req.body.language })
        .where('pricePerHour').lte(req.body.pricePerHour)
        .then(tutor => res.json(tutor))
        .catch(err => res.status(400).json('Error: ' + err));
}

let TimePreference = require('../models/preference');

exports.timepreferences_get_all_of_tutor = (req, res) => {
    TimePreference.find({tutor: req.params.tutorId})
        .populate('tutor')
        .then(timePreferences => res.json(timePreferences))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.timepreferences_add = (req, res) => {
    const tutor = req.params.tutorId;
    const day = req.body.day;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;

    const newTimePreference = new TimePreference({ tutor, day, startTime, endTime });

    newTimePreference.save()
        .then(() => res.json('Time preference added!'))
        .catch(err => res.status(400).json('Error: ' + err));
}


exports.favourite_add = (req, res) => {
    User.updateOne({ _id: req.userData.userId }, { $addToSet:  {favouriteTutors: req.body.tutorId} }, { new: true })
        .then(() => res.json("The tutor was added"))
        .catch(err => res.status(400).json('Error: ' + err));
}


