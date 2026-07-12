"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";

// Resize to at most maxDim on the long edge and re-encode as JPEG.
// Falls back to the original file if decoding fails (e.g. exotic formats).
async function downscaleImage(file, maxDim = 1600) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.type === "image/jpeg") return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) return file;
    return new File([blob], "receipt.jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

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

      // Phone photos can be 10+ MP; downscale before upload so the vision
      // model gets a manageable payload and the request stays fast.
      const upload = await downscaleImage(file);

      const formData = new FormData();
      formData.append("image_file", upload, upload.name || "receipt.jpg");

      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });
      let rawData;
      try {
        rawData = await response.json();
      } catch {
        // Gateway errors (e.g. 504) return plain text, not JSON
        throw new Error(
          response.ok
            ? "Unexpected server response. Please try again."
            : `Server error: ${response.status}. Please try again.`
        );
      }
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
