import React, { useState, useRef } from "react";
import Button from "../components/button";
import { Camera } from "lucide-react";

const scanBillPage = () => {
  // initialize states for image and upload status
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // handle gallery image selection
  const handleGallerySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadError(null);
      handleImageUpload(file);
    }
  };

  // handle camera capture
  const handleCameraCapture = () => {
    // change later for opening camera
    handleGallerySelect();
  };

  // handle image upload
  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);

      // file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      // file size
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be less than 10MB");
      }

      // create preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedImage(reader.result);
      };

      // here the file would be sent to the ai parser
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Image uploaded successfully:", file.name);

      // here the request for the information from the parser
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-8">Scan Document</h1>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Button container */}
      <div className="w-full space-y-4 mb-6">
        <Button
          type="button"
          id="gallery-button"
          onClick={isUploading ? null : handleGallerySelect}
          className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Choose Photo
        </Button>

        <Button
          type="button"
          id="camera-button"
          onClick={isUploading ? null : handleCameraCapture}
          className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Camera className="mr-2" size={20} />
          Scan Document
        </Button>
      </div>
      {/* Loading state */}
      {isUploading && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Uploading...</p>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
          <p>{uploadError}</p>
        </div>
      )}

      {/* Image preview */}
      {selectedImage && !isUploading && (
        <div className="mt-4 w-full">
          <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt="Selected document"
              className="w-full object-contain max-h-64"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default scanBillPage;
