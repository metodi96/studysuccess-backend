//we need the express router and to require the model
const router = require('express').Router();
let User = require('../models/user');
const multer = require('multer');
//saving the image's original name 
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  }, 
  filename: function(req, file, cb) {    
    cb(null, new Date().toISOString().replace(/:|\./g,'') + ' - ' + file.originalname);
  }
});
// only accept jpeg and png files
const fileFilter = (req, file, cb) => {  
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false); //new Error('The image format is not supported!')
  }  
};

const upload = multer({
  storage: storage, 
  limits: {
  fileSize: 1024 * 1024 * 2 //only accept files up to 2MB
  },
  fileFilter: fileFilter
});

//get all users
router.route('/').get((req, res) => {
    //get a list of all the users from the mongodb database 
  User.find()  
   .populate('subjectsToTakeLessonsIn')
   .then(users => res.json(users))
   .catch(err => res.status(400).json('Error: ' + err));
});

//get a specific user
router.route('/:id').get((req, res) => {
  User.findById(req.params.id)    
    .populate('subjectsToTakeLessonsIn')
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//update a user, upload an image - fill in all the fields
router.post('/:id/update', upload.single('userImage'), (req, res) => {
  console.log(req.file)
  User.findById(req.params.id)
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
      user.userImage = req.file.path;

      //check if user is tutor and then update the other fields
      if(user.hasCertificateOfEnrolment && user.hasGradeExcerpt) {
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
});

//this handles incoming http post requests
//users/add
router.route('/add').post((req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const dateOfBirth = req.body.dateOfBirth;
  const semester = req.body.semester;
  const university = req.body.university;
  const studyProgram = req.body.studyProgram;
  const degree = req.body.degree;
 

  const newUser = new User({firstname, lastname, email, dateOfBirth, semester, university, studyProgram, degree});

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

