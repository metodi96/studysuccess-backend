let User = require('../models/user');
let TimePreference = require('../models/preference');
const { request } = require('express');

exports.tutors_get_all = (req, res) => {
    //get a list of all the tutors from the mongodb database 
    console.log("all tutors")
    User.find({
        hasCertificateOfEnrolment: true,
        hasGradeExcerpt: true
    })
        .populate('subjectsToTeach')
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
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.tutors_get_for_subject = (req, res) => {
    console.log("I am in tutors get one for subject " + req.params.subjectId);
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
    console.log("I am in this request");
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
    if(Object.keys(req.body).length > 0) { // if filters have some criteria set
        console.log(req.body);

        if (req.body.pricePerHour && req.body.language === undefined && req.body.dayTime === undefined) {
            console.log('price only')
            User.find({
                hasCertificateOfEnrolment: true,
                hasGradeExcerpt: true,
                 'subjectsToTeach': req.params.subjectId })
                .populate('subjectsToTakeLessonsIn')
                .populate('subjectsToTeach')
                .where('pricePerHour').lte(req.body.pricePerHour)
                .then(tutor => { console.log(tutor); res.json(tutor) })
                .catch(err => res.status(400).json('Error: ' + err));
        }
        else if (req.body.pricePerHour === undefined && req.body.language && req.body.dayTime === undefined) {
            console.log('languages only')
            User.find({
                hasCertificateOfEnrolment: true,
                hasGradeExcerpt: true,
                subjectsToTeach: req.params.subjectId,
                languages: req.body.language
            })
                .populate('subjectsToTakeLessonsIn')
                .populate('subjectsToTeach')
                .then(tutor => { console.log(tutor); res.json(tutor) })
                .catch(err => res.status(400).json('Error: ' + err));
        }
        else if (req.body.language && req.body.pricePerHour && req.body.dayTime === undefined) { // if language filtering is set
            console.log('languages and price')
            User.find({
                hasCertificateOfEnrolment: true,
                hasGradeExcerpt: true,
                subjectsToTeach: req.params.subjectId,
                languages: req.body.language
            })
                .populate('subjectsToTakeLessonsIn')
                .populate('subjectsToTeach')
                .where('pricePerHour').lte(req.body.pricePerHour)
                .then(tutor => { console.log(tutor); res.json(tutor) })
                .catch(err => res.status(400).json('Error: ' + err));
        }
        else if (req.body.dayTime && req.body.language === undefined && req.body.pricePerHour === undefined) { // if time availability filtering is set
            console.log('day time only')
            if(req.body.dayTime ==  1) {
                TimePreference.find({ 'startTime.hours' : { "$in" : ['07','08','09','7', '8','9','10','11','12','13']}})
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor )
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            '_id': { "$in": newList }
                        })
                                .then(tutor => { console.log(tutor); res.json(tutor) })
                                .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if(req.body.dayTime == 2) {
                TimePreference.find({ 'startTime.hours': { "$in": ['14', '15', '16', '17', '18', '19'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            '_id': { "$in": newList }
                        })
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if(req.body.dayTime == 3) {
                TimePreference.find({ 'startTime.hours': { "$in": ['20', '21', '22'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            '_id': { "$in": newList }
                        })
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if(req.body.dayTime == 4) {
                TimePreference.find().where('day').equals(6).or('day').equals(0)
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            '_id': { "$in": newList }
                        })
                            .then(tutor => {res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        }
        else if (req.body.dayTime && req.body.language && req.body.pricePerHour === undefined) { // if time availability filtering is set
            if (req.body.dayTime == 1) {
                TimePreference.find({ 'startTime.hours': { "$in": ['07', '08', '09', '7', '8', '9', '10', '11', '12', '13'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            languages: req.body.language,
                            '_id': { "$in": newList } })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .then(tutor => {res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 2) {
                TimePreference.find({ 'startTime.hours': { "$in": ['14', '15', '16', '17', '18', '19'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            languages: req.body.language,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 3) {
                TimePreference.find({ 'startTime.hours': { "$in": ['20', '21', '22'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            languages: req.body.language,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 4) {
                TimePreference.find().where('day').equals(6).or('day').equals(0)
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            languages: req.body.language,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        }

        else if (req.body.dayTime && req.body.language === undefined && req.body.pricePerHour) { // if time availability filtering is set
            if (req.body.dayTime == 1) {
                TimePreference.find({ 'startTime.hours': { "$in": ['07', '08', '09', '7', '8', '9', '10', '11', '12', '13'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .where('pricePerHour').lte(req.body.pricePerHour)
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 2) {
                TimePreference.find({ 'startTime.hours': { "$in": ['14', '15', '16', '17', '18', '19'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .where('pricePerHour').lte(req.body.pricePerHour)
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 3) {
                TimePreference.find({ 'startTime.hours': { "$in": ['20', '21', '22'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .where('pricePerHour').lte(req.body.pricePerHour)
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 4) {
                TimePreference.find().where('day').equals(6).or('day').equals(0)
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .where('pricePerHour').lte(req.body.pricePerHour)
                            .then(tutor => {res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        }

        else if (req.body.dayTime && req.body.language && req.body.pricePerHour) { // if time availability filtering is set
            if (req.body.dayTime == 1) {
                TimePreference.find({ 'startTime.hours': { "$in": ['07', '08', '09', '7', '8', '9', '10', '11', '12', '13'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            languages: req.body.language,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .where('pricePerHour').lte(req.body.pricePerHour)
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 2) {
                TimePreference.find({ 'startTime.hours': { "$in": ['14', '15', '16', '17', '18', '19'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            languages: req.body.language,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .where('pricePerHour').lte(req.body.pricePerHour)
                            .then(tutor => {res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 3) {
                TimePreference.find({ 'startTime.hours': { "$in": ['20', '21', '22'] } })
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            languages: req.body.language,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .where('pricePerHour').lte(req.body.pricePerHour)
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
            else if (req.body.dayTime == 4) {
                TimePreference.find().where('day').equals(6).or('day').equals(0)
                    .then(timePrefList => {
                        let newList = timePrefList.map(item => item.tutor)
                        User.find({
                            hasCertificateOfEnrolment: true,
                            hasGradeExcerpt: true,
                            subjectsToTeach: req.params.subjectId,
                            languages: req.body.language,
                            '_id': { "$in": newList }
                        })
                            .populate('subjectsToTakeLessonsIn')
                            .populate('subjectsToTeach')
                            .where('pricePerHour').lte(req.body.pricePerHour)
                            .then(tutor => { res.json(tutor) })
                            .catch(err => res.status(400).json('Error: ' + err))
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        }
    }
    else { // otherwise, use request for all tutors for the given subject
        console.log('nothing')
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


