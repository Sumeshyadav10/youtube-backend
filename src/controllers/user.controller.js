const asynchandler = require('../utils/asynchandler');
const User = require('../models/User.model');
const apiError = require('../utils/apiError');
const uploadOnCloudinary = require('../utils/cloudinary');
const ApiResponse = require('../utils/apiResponse');

const registerUser = asynchandler(async (req, res) => { 
    const { username, email, password, fullname } = req.body;
    console.log(req.files);

    if ([username, email, password].includes(undefined)) {
        throw new apiError(400, 'Please provide all the required details');
    }

    const existedUser = await User.findOne({
        $or: [{ email: email }, { username: username }]
    }).lean();

    if (existedUser) {
        throw new apiError(409, 'User already exists');
    }

    const avatarLocalPath = req.files?.avatar ? req.files.avatar.tempFilePath : null;
    const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage.tempFilePath : null;

    if (!avatarLocalPath) {
        throw new apiError(400, 'Please provide an avatar');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("avatar", avatar);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        
        throw new apiError(500, 'Failed to upload avatar');
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || null
    });

    const createdUser = await User.findById(user._id).select('-password -refresh_token').lean();

    if (!createdUser) {
        throw new apiError(500, 'Failed to create user');
    }

    return res.status(201).json(new ApiResponse(201, 'User registered successfully', createdUser));
});

module.exports = registerUser;