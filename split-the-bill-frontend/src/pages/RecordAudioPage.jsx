import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
const RecordAudioPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      if (audioChunksRef.current.length === 0) {
        console.warn(
          "⚠️ No se recibieron datos de audio. La grabación está vacía."
        );
        setAudioBlob(null);
        return;
      }

      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      console.log("✅ Grabación detenida");
      console.log("🔢 Chunks recibidos:", audioChunksRef.current.length);
      console.log("📦 Tamaño del blob:", blob.size, "bytes");
      console.log("📄 Tipo MIME:", blob.type);

      if (blob.size === 0) {
        console.warn(
          "⚠️ El blob generado está vacío. Algo falló en la grabación."
        );
      }

      setAudioBlob(blob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.webm"); // 👈 nombre corregido
    try {
      const response = await axios.post("/api/voice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Audio uploaded successfully:", response.data);
    } catch (error) {
      console.error(
        "Error uploading audio:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h3>Record Audio</h3>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioBlob && (
        <div>
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <button onClick={uploadAudio}>Upload Audio</button>
        </div>
      )}
    </div>
  );
};

export default RecordAudioPage;
