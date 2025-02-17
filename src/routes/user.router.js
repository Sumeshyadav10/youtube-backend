const router = require('express').Router();
const registerUser = require('../controllers/user.controller');
const upload = require('../middlewares/multer.middleware');


router.post('/register',upload.fields
(
    [
        {
            name:'avatar',
            maxCount:1
        },
        {
            name:'cover images',
            maxCount:5
        }
    ]   
), registerUser);    // Route to register a user



module.exports = router;    // Export the router