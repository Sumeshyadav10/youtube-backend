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

const AddProfileDetails = asynchandler(async (req, res) => {
    const {username} = req.params;
    if(!username){
        throw new apiError(400, 'Please provide username');
    }
   const channel = await User.aggregate([
    {
        $match:{
            username: username
        }
    },
    {
        $lookup:{
            from: 'subscriptions',
            localField: '_id',
            foreignField: 'channel',
            as: 'subscribers'
        }
    },{
        $lookup:{
            from: 'subscriptions',
            localField: '_id',
            foreignField: 'subscriber',
            as: 'subscribedTo'
    }
    },{
        $addFields:{
            subscriberCount: {$size: '$subscribers'},
            subscribedToCount: {$size: '$subscribedTo'},
            isSubscribed: {
                $in: [req.user?._id, '$subscribers.subscriber'],
                then: true,
                else: false
            }
        }
    },{
        $project:{
            username:1,
            fullname:1,
            avatar:1,
            coverImage:1,
            isSubscribed:1,
            email:1,
            subscriberCount:1,
            subscribedToCount:1
        }
    }
   ])
   if(!channel?.length){
       throw new apiError(404, 'Channel not found');
   }
    return res.status(200).json(new ApiResponse(200, channel[0], 'Channel details'));
   
});

const getWatchhistory = asynchandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: '_id',
                as: 'watchHistory',
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline:[
                                {
                                    $project:{
                                        username:1,
                                        fullname:1,
                                        avatar:1
                                    }
                                }
                            ]
                    }
                }
                ]

            }
            
        },
        {
            $addFields : {
                owner:{
                    $first: "$owner"
                }
            }
        },
       
    ]); 
    return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, 'watch History fetched successfully'));

});

module.exports = {registerUser, AddProfileDetails, getWatchhistory};