const asynchandler = require('../utils/asynchandler');


const registerUser = asynchandler(async (req, res) => { 
    // Code to register a user
    res.status(200).json({message: 'User registered successfully'});
});

module.exports = registerUser;