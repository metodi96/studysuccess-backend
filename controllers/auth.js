let User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.get_profile = (req, res) => {
    User.findById(req.userData.userId)
        .populate('subjectsToTakeLessonsIn')
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.update_profile = (req, res) => {
    User.findById(req.userData.userId)
        .then(user => {
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.dateOfBirth = req.body.dateOfBirth;
            user.semester = req.body.semester;
            user.university = req.body.university;
            user.studyProgram = req.body.studyProgram;
            user.degree = req.body.degree;
            user.subjectsToTakeLessonsIn = req.body.subjectsToTakeLessonsIn;
            user.hasCertificateOfEnrolment = req.body.hasCertificateOfEnrolment;
            user.hasGradeExcerpt = req.body.hasGradeExcerpt;
            if(req.file != undefined) {
                user.userImage = req.file.path;
            }

            //check if user is tutor and then update the other fields
            if (user.hasCertificateOfEnrolment && user.hasGradeExcerpt) {
                user.pricePerHour = req.body.pricePerHour;
                user.personalStatement = req.body.personalStatement;
                user.languages = req.body.languages;
                user.subjectsToTeach = req.body.subjectsToTeach;
            }

            user.save()
                .then(() => user.hasCertificateOfEnrolment && user.hasGradeExcerpt ? res.json('User updated to tutor!') : res.json('User updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const email = req.body.email;
            const password = hash;
            const dateOfBirth = req.body.dateOfBirth;
            const semester = req.body.semester;
            const university = req.body.university;
            const studyProgram = req.body.studyProgram;
            const degree = req.body.degree;


            const newUser = new User({ firstname, lastname, email, password, dateOfBirth, semester, university, studyProgram, degree });

            newUser.save()
                .then(() => res.status(201).json('User added!'))
                .catch(err => res.status(500).json('Error: ' + err));
        }
    })
}

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                return res.status(401).json({
                    message: 'Authentication failed - no user found with this email'
                })
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Authentication failed'
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, process.env.JWT_KEY,
                            {
                                expiresIn: '1h'
                            });
                        return res.status(200).json({
                            message: 'Authentication successful',
                            token: token
                        });
                    }
                    return res.status(401).json({
                        message: 'Authentication failed - invalid password'
                    });
                })
            }
        })
        .catch(err => res.status(500).json('Error: ' + err));
}