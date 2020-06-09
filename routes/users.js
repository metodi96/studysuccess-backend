//we need the express router
const router = require('express').Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const UsersController = require('../controllers/users');

//saving the image's original name 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:|\./g, '') + ' - ' + file.originalname);
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

//get all users - we don't need that for now, just for testing purposes in postman
//router.get('/', checkAuth, UsersController.users_get_all);

//get a specific user
router.get('/profile', checkAuth, UsersController.users_get_profile);

//update a user, upload an image - fill in all the fields
router.put('/profile/update', checkAuth, upload.single('userImage'), UsersController.users_update_profile);

//users/signup
router.post('/signup', UsersController.users_signup);

router.post('/login', UsersController.users_login);

module.exports = router;

