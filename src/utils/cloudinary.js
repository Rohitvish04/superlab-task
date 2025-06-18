import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_API_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECREAT   
});

const cloudinaryUploadFile = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded to Cloudinary successfully:", result.url);

        // Delete file after upload
        // if (fs.existsSync(localFilePath)) {
        //     fs.unlinkSync(localFilePath);
        // }

        return result;

    } catch (error) {
         console.error("Cloudinary upload failed:", error?.Message || error || "Unknown error");


        // Attempt to clean up temp file if it still exists
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (fsErr) {
                console.error("Failed to delete local file:", fsErr.Message);
            }
        }

        throw error;
    }
};

export default cloudinaryUploadFile;
