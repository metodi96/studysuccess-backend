let Subject = require('../models/subject');

exports.subjects_get_all = (req, res) => {
    Subject.find()
        .then(subjects => res.json(subjects))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.subjects_get_one = (req, res) => {
    Subject.findById(req.params.id)

        .then(subject => res.json(subject))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.subjects_add = (req, res) => {
    const name = req.body.name;
    const description = req.body.description;

    const newSubject = new Subject({ name, description });

    newSubject.save()
        .then(() => res.json('Subject added!'))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.subjects_delete_one = (req, res) => {
    Subject.findByIdAndDelete(req.params.id)
        .then(() => res.json('Subject deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
}