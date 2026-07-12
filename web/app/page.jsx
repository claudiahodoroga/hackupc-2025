"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";

const ScanBillPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleGallerySelect = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setParsedData(null);
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be less than 10MB");
      }

      const formData = new FormData();
      formData.append("image_file", file);

      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });
      const rawData = await response.json();
      if (!response.ok) {
        throw new Error(rawData.detail || `Server error: ${response.status}`);
      }

      // Expects { "ItemName1": price1, "ItemName2": price2, ... }
      const items = Object.entries(rawData).map(([name, price]) => ({
        name,
        price: typeof price === "number" ? price : parseFloat(price) || 0,
      }));
      const total = items.reduce((sum, item) => sum + item.price, 0);

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

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setParsedData(null);
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const goToSummary = () => {
    if (parsedData) {
      sessionStorage.setItem("billData", JSON.stringify(parsedData));
      router.push("/summary");
    }
  };

  return (
    <div className="app-frame">
      <div className="scan-bill-container">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {!selectedImage && !isUploading && (
          <>
            <div className="scanner-outline">
              <Camera className="scanner-icon" size={64} />
            </div>

            <button className="scan-button" onClick={handleGallerySelect}>
              Scan bill
            </button>

            <button className="photo-button" onClick={handleGallerySelect}>
              Choose Photo
            </button>
          </>
        )}

        {isUploading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Uploading and analyzing...</p>
          </div>
        )}

        {uploadError && !isUploading && (
          <div className="error-message">
            <p>Error: {uploadError}</p>
          </div>
        )}

        {uploadSuccess && !isUploading && !uploadError && (
          <div className="success-message">
            <p>Success! Image analyzed.</p>
          </div>
        )}

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

            {parsedData && !uploadError && (
              <button className="summary-button" onClick={goToSummary}>
                View Bill Summary
              </button>
            )}

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
