import { useState, useRef, useEffect } from "react";
import { aiService } from "../services/aiService";

export const useVoiceOrder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError("Không thể truy cập microphone");
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    setProcessing(true);
    try {
      const result = await aiService.recognizeVoiceOrder(audioBlob);
      setTranscript(result.transcript || "");
      return result;
    } catch (err) {
      setError("Không thể xử lý giọng nói");
      console.error("Error processing audio:", err);
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setError(null);
  };

  return {
    isRecording,
    transcript,
    processing,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
  };
};
