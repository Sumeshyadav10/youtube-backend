const router = require('express').Router();
const registerUser = require('../controllers/user.controller');
const upload = require('../middlewares/multer.middleware');
const {loginUser,logoutUser} = require('../controllers/login.controller');
const verifyJWT = require('../middlewares/auth.middleware');
const { refreshToken } = require('../controllers/refreshToken.controller');
const { changePassword, getCurrentUser, updateAccountDetails,changeAvatar,changeCoverImages } = require('../controllers/changeUserProfile');


// router.post('/register',upload.fields
// (
//     [
//         {
//             name:'avatar',
//             maxCount:1
//         },
//         {
//             name:'cover images',
//             maxCount:5
//         }
//     ]   
// ), registerUser);    // Route to register a user
// exluded multer and use fileupload in app.js

router.post('/register', registerUser);    // Route to register a user
router.post('/login', loginUser);    // Route to login a user
router.post('/logout',verifyJWT, logoutUser);    // Route to logout a user
router.post('/refresh-token', refreshToken);    // Route to refresh the access token
router.put('/change-password', verifyJWT, changePassword);    // Route to change the password
router.get('/get-user', verifyJWT, getCurrentUser);    // Route to get the current user
router.put('/update-account', verifyJWT, updateAccountDetails);    // Route to update the account details
router.put('/change-avatar', verifyJWT, upload.single('avatar'), changeAvatar);    // Route to change the avatar using multer
router.put('/change-cover-images', verifyJWT, upload.array('cover images', 5), changeCoverImages);    // Route to change the cover images using multer


module.exports = router;    // Export the router