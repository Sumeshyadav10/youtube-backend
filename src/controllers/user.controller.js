const asynchandler = require('../utils/asynchandler');
const User = require('../models/User.model');
const apiError = require('../utils/apiError');
const uploadOnCloudinary = require('../utils/cloudinary');
const ApiResponse = require('../utils/apiResponse');

const registerUser = asynchandler(async (req, res) => { 
    // Code to register a user
    // collect the information from user
    // validation -- not empty
    // check already exist
    // check required details schema
    // upload to cloudinary(avatar)
    // create a new user
    // save the user to the database
    // send a response to the user
    const { username, email, password,fullname } = req.body;
    console.log(email);

    if ([username, email, password].includes(undefined)) {
        throw new apiError(400, 'Please provide all the required details');
    }

  const existedUser =  User.findOne({
        $or: [{ email: email },
            { username: username } ]      
    });

    if (existedUser) {
        throw new apiError(409, 'User already exists');
    }

    const avatarLocalPath = req.files?.avatar ? req.files.avatar[0].path : null;
    const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage[0].path : null;

    if (!avatarLocalPath) {
        throw new apiError(400, 'Please provide an avatar');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if(!avatar){
        throw new apiError(500, 'Failed to upload avatar');
    }

    const user = await User.create({
        username : username.tolowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || null
    })

    const createduser = user.findbyId(user._id).select(
        '-password -refresh_token'
    );
    if(!createduser){
        throw new apiError(500, 'Failed to create user');
    }
    return  res.status(201).json(new ApiResponse(201, 'User registered successfully', createduser));


});

module.exports = registerUser;