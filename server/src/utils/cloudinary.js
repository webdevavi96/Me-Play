import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        // Uploading the file to cloudinary.
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File successfully uploaded to cloud. The publuic url is here: ", response.url);

        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporsry file as the upload operation got failed.
        console.error(error);
        return null;
    }
};

export default uploadToCloudinary;