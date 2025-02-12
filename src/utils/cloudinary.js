const v2 = require('cloudinary').v2;
const fs = require('fs');

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath){
            throw new Error('File path is required');
        }
        const response = await v2.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        console.log('file is uploaded on cloudinary',response.url);
        return response;
    } catch (error){
        fs.unlinkSync(localFilePath )
    }
}