import React, { useState, useRef } from "react";
import Button from "../components/button"; // Import the Button component
import { Camera, X } from "lucide-react"; // Import camera and X icons
//import { useNavigate } from "react-router-dom";
import axios from "axios";

const ScanBillPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  //const navigate = useNavigate();

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
      setUploadSuccess(false);
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
      console.log("File selected:", file); // Check the File object
      //handleImageUpload(file); // You're still passing 'file' here, let's keep it for now
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

  useEffect(() => {
    if (selectedImageFile) {
      console.log("selectedImageFile state in useEffect: ", selectedImageFile);
      handleImageUpload();
    }
  }, [selectedImageFile]);

  // Handle image upload
  const handleImageUpload = async () => {
    console.log("handleImageUpload called with file"); // Check if it receives anything
    console.log(
      "selectedImageFile state inside handleImageUpload:",
      selectedImageFile
    ); // Check the state here

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setParsedData(null);
    try {
      // client-side validation
      if (!selectedImageFile?.type?.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be less than 10MB");
      }

      const formData = new FormData();
      formData.append("image", selectedImageFile); // 'selectedImageFile' es un objeto File

      const response = await axios.post("/api/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `API Error: ${response.status} - ${
            errorData || "Failed to analyze image"
          }`
        );
      }

      const rawData = await response.json();
      // Expects { "ItemName1": price1, "ItemName2": price2, ... }

      // Parse the data (assuming object format {name: price})
      const items = Object.entries(rawData).map(([name, price]) => ({
        name,
        // Ensure price is a number
        price: typeof price === "number" ? price : parseFloat(price) || 0,
      }));

      const total = items.reduce((sum, item) => sum + item.price, 0);

      // Store the parsed items and total for summary page
      setParsedData({ items, total });
      setUploadSuccess(true);

      console.log("Image analyzed successfully:", { items, total });
    } catch (error) {
      console.error("Upload/API error:", error);
      setSelectedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setParsedData(null);
    setUploadError(null);
    setUploadSuccess(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Navigate to bill summary page
  const goToSummary = () => {
    if (parsedData) {
      //navigate("/BillSummaryPage", { state: { billData: parsedData } }); // Pass data in state
      console.log(parsedData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-8">Scan Bill</h1>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {/* Buttons shown only if no image is selected */}
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
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
            disabled={isUploading}
          >
            <Camera className="mr-2" size={20} />
            Scan Document
          </Button>
        </div>
      )}

      {/* Loading Indicator */}
      {isUploading && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Uploading and analyzing...</p>
        </div>
      )}

      {/* Error Message */}
      {uploadError && !isUploading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
          <p>Error: {uploadError}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && !isUploading && !uploadError && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-full">
          <p>Success! Image analyzed.</p>
        </div>
      )}

      {/* Image Preview and Actions */}
      {selectedImage && !isUploading && (
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Bill Preview</h2>
            <Button
              type="button"
              onClick={handleRemoveImage}
              className="flex items-center text-red-500 hover:text-red-700"
            >
              <X size={16} className="mr-1" />
              Remove
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden mb-4">
            <img
              src={selectedImage}
              alt="Selected bill"
              className="w-full object-contain max-h-64"
            />
          </div>

          {/* Display raw parsed data for testing (optional) */}
          {/* {parsedData && (
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto mb-4">
                            {JSON.stringify(parsedData, null, 2)}
                        </pre>
                    )} */}

          {/* --- View Bill Summary Button --- */}
          {parsedData && !uploadError && (
            <Button
              type="button"
              onClick={goToSummary}
              className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors mt-4"
            >
              View Bill Summary
            </Button>
          )}

          {/* Button to Scan Again if an image was selected */}
          <Button
            type="button"
            onClick={handleGallerySelect} // Or handleCameraCapture if preferred
            className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors mt-2"
          >
            Scan Another Bill
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScanBillPage;
