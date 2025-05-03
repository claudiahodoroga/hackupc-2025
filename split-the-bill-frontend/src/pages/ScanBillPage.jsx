import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X, ArrowLeft } from "lucide-react"; // Import Arrow icon
import "../assets/styles/ScanBillPage.css"; // Import our new CSS file

const ScanBillPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle gallery image selection
  const handleGallerySelect = () => {
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
      handleImageUpload(file);
      e.target.value = "";
    }
  };

  // Handle camera capture
  const handleCameraCapture = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setParsedData(null);
    try {
      // client-side validation
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be less than 10MB");
      }

      const formData = new FormData();
      formData.append("image", file);

      // Simulate API call - replace with actual API in production
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response data
      const mockData = {
        Coffee: 4.5,
        Sandwich: 8.95,
        Pastry: 3.75,
      };

      // Parse the data (assuming object format {name: price})
      const items = Object.entries(mockData).map(([name, price]) => ({
        name,
        price: typeof price === "number" ? price : parseFloat(price) || 0,
      }));

      const total = items.reduce((sum, item) => sum + item.price, 0);

      // Store the parsed items and total for summary page
      setParsedData({ items, total });
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload/API error:", error);
      setUploadError(error.message);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Navigate to bill summary page
  const goToSummary = () => {
    if (parsedData) {
      navigate("/BillSummaryPage", { state: { billData: parsedData } });
    }
  };

  // Navigate back
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-frame">
      <div className="scan-bill-container">
        <ArrowLeft className="back-arrow" size={24} onClick={goBack} />
        <h1 className="page-title">Scan Bill</h1>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {/* Camera scanner outline shown only when no image selected */}
        {!selectedImage && !isUploading && (
          <>
            <div className="scanner-outline">
              <Camera className="scanner-icon" size={64} />
            </div>

            <button className="scan-button" onClick={handleCameraCapture}>
              Scan
            </button>

            <button className="photo-button" onClick={handleGallerySelect}>
              Choose Photo
            </button>
          </>
        )}

        {/* Loading Indicator */}
        {isUploading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Uploading and analyzing...</p>
          </div>
        )}

        {/* Error Message */}
        {uploadError && !isUploading && (
          <div className="error-message">
            <p>Error: {uploadError}</p>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && !isUploading && !uploadError && (
          <div className="success-message">
            <p>Success! Image analyzed.</p>
          </div>
        )}

        {/* Image Preview and Actions */}
        {selectedImage && !isUploading && (
          <div className="image-preview-container">
            <div className="preview-header">
              <h2 className="preview-title">Bill Preview</h2>
              <button className="remove-button" onClick={handleRemoveImage}>
                <X size={16} className="mr-1" />
                Remove
              </button>
            </div>

            <img
              src={selectedImage}
              alt="Selected bill"
              className="bill-image"
            />

            {/* View Bill Summary Button */}
            {parsedData && !uploadError && (
              <button className="summary-button" onClick={goToSummary}>
                View Bill Summary
              </button>
            )}

            {/* Button to Scan Again if an image was selected */}
            <button className="scan-again-button" onClick={handleGallerySelect}>
              Scan Another Bill
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanBillPage;
