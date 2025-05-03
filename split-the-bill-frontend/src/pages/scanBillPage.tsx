import React, { useState, useRef } from "react";
import Button from "../components/button";
import {Camera} from 'lucide-react';

const scanBillPage = () => {
    // initialize states for image and upload status
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // handle gallery image selection
  const handleGallerySelect = () => {
    fileInputRef.current.click();
  };

  // handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file){
        setUploadError(null);
        handleImageUpload(file);
    }
  };

  // handle camera capture
  const handleCameraCapture = () => {
    // change later for opening camera
    fileInputRef.current.click();
  };

  // handle image upload
  const handleImageUpload = async (file) => {
    try{
        setIsUploading(true);

        // file type
        if(!file.type.startsWith('image/')){
            throw new Error('Please select an image file.');
        }

        // file size
        if(file.size > 10 * 1024 * 1024){
            throw new Error('Image size must be less than 10MB');
        }

        // create preview
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setSelectedImage(reader.result);
        };

        // here the file would be sent to the ai parser
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Image uploaded successfully:', file.name);

        // here the request for the information from the parser
    } catch(error){
        console.error('Upload error:', error);
        setUploadError(error.message || 'Failed to upload image');
    } finally {
        setIsUploading(false);
    }
  };

return (
    
    );
};

export default scanBillPage;
