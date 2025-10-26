import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadVideo() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle video file preview
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
  };

  // Upload video to backend
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !videoFile) {
      alert("Please fill all required fields and select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      setUploading(true);
      const res = await axios.post("/api/v1/videos/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        alert("✅ Video uploaded successfully!");
        navigate("/home");
      } else {
        alert("Failed to upload video.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong while uploading the video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg mt-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Upload a New Video
      </h1>

      <form onSubmit={handleUpload} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-2 text-gray-300 font-medium">
            Video Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-gray-300 font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Describe your video..."
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-600 resize-none"
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block mb-2 text-gray-300 font-medium">
            Thumbnail (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block mb-2 text-gray-300 font-medium">
            Select Video <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-gray-300 mb-2">Preview:</p>
            <video
              src={previewUrl}
              controls
              className="w-full rounded-lg border border-gray-700"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={uploading}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              uploading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadVideo;
