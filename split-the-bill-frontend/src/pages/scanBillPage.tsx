import React, { useState, useRef } from "react";
import Button from "../components/button"; // Import the Button component
import { Camera, X } from "lucide-react"; // Import camera and X icons

const ScanBillPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle gallery image selection
  const handleGallerySelect = () => {
    // Only proceed if not uploading and ref exists
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadError(null);
      handleImageUpload(file);
      // Reset the input value so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  // Handle camera capture
  const handleCameraCapture = () => {
    // Only proceed if not uploading and ref exists
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      setParsedData(null);

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be less than 10MB");
      }

      // Create a preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        // Fix the setState with string issue
        const result = e.target.result;
        setSelectedImage(result);
      };

      // Prepare the form data for API submission
      const formData = new FormData();
      formData.append("image", file);

      // Call the AI API to analyze the image
      try {
        // Replace with your actual API endpoint
        const response = await fetch("https://your-api-endpoint.com/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Process the parsed data
        setParsedData({
          item: data.item || "Unknown item",
          price: data.price || "Unknown price",
          total: data.total || "Unknown total",
        });

        console.log("Image analyzed successfully:", data);
      } catch (apiError) {
        console.error("API error:", apiError);
        // Don't throw here to still show the image even if API fails
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setParsedData(null);
    setUploadError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-8">Scan Document</h1>

      {/* Hidden file input - make sure it's really hidden */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {/* Only show button container if no image is selected */}
      {!selectedImage && (
        <div className="w-full space-y-4 mb-6">
          <Button
            type="button"
            id="gallery-button"
            onClick={handleGallerySelect}
            className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Choose Photo
          </Button>

          <Button
            type="button"
            id="camera-button"
            onClick={handleCameraCapture}
            className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Camera className="mr-2" size={20} />
            Scan Document
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isUploading && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Uploading and analyzing...</p>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
          <p>{uploadError}</p>
        </div>
      )}

      {/* Image preview and remove button */}
      {selectedImage && !isUploading && (
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Document Preview</h2>
            <Button
              type="button"
              onClick={handleRemoveImage}
              className="flex items-center text-red-500 hover:text-red-700"
            >
              <X size={16} className="mr-1" />
              Remove
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden relative">
            <img
              src={selectedImage}
              alt="Selected document"
              className="w-full object-contain max-h-64"
            />
          </div>

          {/* Parsed data display */}
          {parsedData && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-md font-semibold mb-2">
                Extracted Information
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="font-medium">Item:</span>
                  <span>{parsedData.item}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>{parsedData.price}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span>{parsedData.total}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Re-scan button */}
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleGallerySelect}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Scan Another Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanBillPage;
