//we need the express router
const router = require('express').Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const AuthController = require('../controllers/auth');

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

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
//get a specific user
router.get('/profile', checkAuth, AuthController.get_profile);
//update a user, upload an image - fill in all the fields
router.put('/profile/update', checkAuth, upload.single('userImage'), AuthController.update_profile);

module.exports = router;