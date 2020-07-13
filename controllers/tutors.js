let User = require('../models/user');
let TimePreference = require('../models/preference');

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
        .then(tutor => {
            console.log(tutor);
            res.json(tutor);
        })
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
    if(Object.keys(req.body).length > 0) {
        console.log(req.body);
        var promise = User.find({
                hasCertificateOfEnrolment: true,
                hasGradeExcerpt: true
            })
            .populate('subjectsToTakeLessonsIn')
            .populate('subjectsToTeach')
            .find({ 'subjectsToTeach': req.params.subjectId})
            .where('pricePerHour').lte(req.body.pricePerHour);
        if(req.body.language) {
            promise = promise.find({'languages': req.body.language});
        }
        if(req.body.dayTime) {
            if(req.body.dayTime ==  1) {
                TimePreference.find({ 'startTime.hours' : { "$in" : ['07','08','09','7', '8','9','10','11','12','13']}})
                    .then(timePrefList => timePrefList.map(item => item.tutor ))
                    .catch(err => res.status(400).json('Error: ' + err))
                    .then(newList => promise = promise.find( { '_id': {"$in" : newList} } ))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if(req.body.dayTime == 2) {
                TimePreference.find({ 'startTime.hours' : { "$in" : ['14', '15','16','17','18','19']}})
                    .then(timePrefList => timePrefList.map(item => item.tutor ))
                    .catch(err => res.status(400).json('Error: ' + err))
                    .then(newList => promise = promise.find( { '_id': {"$in" : newList} } ))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if(req.body.dayTime == 3) {
                TimePreference.find({ 'startTime.hours' : { "$in" : ['14', '15','16','17','18','19']}})
                    .then(timePrefList => timePrefList.map(item => item.tutor ))
                    .catch(err => res.status(400).json('Error: ' + err))
                    .then(newList => promise = promise.find( { '_id': {"$in" : newList} } ))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if(req.body.dayTime == 4) {
                TimePreference.where('day').gte(6)
                    .then(timePrefList => timePrefList.map(item => item.tutor))
                    .catch(err => res.status(400).json('Error: ' + err))
                    .then(newList => promise = promise.find( { '_id': {"$in" : newList} } ))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        }
        promise.then(tutor => res.json(tutor))
            .catch(err => res.status(400).json('Error: ' + err));
    }
    else {
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
}

exports.timepreferences_get_all_of_tutor = (req, res) => {
    TimePreference.find({tutor: req.params.tutorId})
        //.populate('tutor')
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


