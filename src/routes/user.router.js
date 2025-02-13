const router = require('express').Router();
const registerUser = require('../controllers/user.controller');


router.post('/register', registerUser);    // Route to register a user

module.exports = router;    // Export the router