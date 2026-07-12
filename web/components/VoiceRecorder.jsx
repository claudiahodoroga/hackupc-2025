"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Square, X } from "lucide-react";

// Records audio in the browser and sends it to /api/voice together with the
// bill's products; on success calls onAssignments with {product: [names]}.
const VoiceRecorder = ({ products, onAssignments, onClose }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (audioChunksRef.current.length === 0) {
          setError("The recording was empty. Please try again.");
          return;
        }
        setAudioBlob(new Blob(audioChunksRef.current, { type: "audio/webm" }));
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;
    setProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.webm");
      formData.append("products", JSON.stringify(products));

      const response = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      });
      let data;
      try {
        data = await response.json();
      } catch {
        // Gateway errors (e.g. 504) return plain text, not JSON
        throw new Error(`Server error: ${response.status}. Please try again.`);
      }
      if (!response.ok) {
        throw new Error(data.detail || `Server error: ${response.status}`);
      }
      onAssignments(data.assignments, data.transcript);
    } catch (err) {
      console.error("Error uploading audio:", err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="voice-overlay">
      <div className="voice-modal">
        <div className="voice-modal-header">
          <h3>Tell the AI who pays</h3>
          <button className="voice-close" onClick={onClose} disabled={processing}>
            <X size={18} />
          </button>
        </div>

        <p className="voice-hint">
          Example: &ldquo;I&rsquo;ll pay for the burger, Antonia and Pepe split
          the fries, and Jose takes the coke.&rdquo; (English only)
        </p>

        <div className="voice-controls">
          <button
            className={`voice-record-button ${recording ? "recording" : ""}`}
            onClick={recording ? stopRecording : startRecording}
            disabled={processing}
          >
            {recording ? <Square size={20} /> : <Mic size={20} />}
            {recording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>

        {audioBlob && !recording && (
          <div className="voice-preview">
            <audio controls src={audioUrl} />
            <button
              className="accept-button"
              onClick={uploadAudio}
              disabled={processing}
            >
              {processing ? "Analyzing..." : "Split with AI"}
            </button>
          </div>
        )}

        {processing && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Transcribing and assigning items...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default VoiceRecorder;
