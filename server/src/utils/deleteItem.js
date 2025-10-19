import cloudinary from "../config/cloudinary.config.js";

const deleteItem = async (resourceUrl, type = "auto") => {
    if (!resourceUrl) return { message: "Resource url not found" };
    const publicId = getPublicIdFromUrl(resourceUrl);
    try {
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: type
        });
        return response;
    } catch (error) {
        return { message: error.message || "Error while deleting file" };
    }
};

function getPublicIdFromUrl(resourceUrl) {
    const parts = resourceUrl.split("/");
    const filename = parts.slice(parts.indexOf("upload") + 1).join("/");
    return filename.split(".")[0]; // remove extension
}

export default deleteItem;