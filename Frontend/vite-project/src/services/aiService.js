import { api } from "./api";

export const aiService = {
  // Voice recognition
  recognizeVoiceOrder: async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice-order.webm");

    const token = localStorage.getItem("token");
    const response = await fetch("https://localhost:7031/api/ai/recognize", {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Voice recognition failed");
    // Returns: { detectedText, productId, confidence }
    return response.json();
  },

  // Voice logs
  getAllVoiceLogs: async () => {
    return api.get("/voice-logs");
  },

  getVoiceLogById: async (id) => {
    return api.get(`/voice-logs/${id}`);
  },

  getVoiceLogsByStaff: async (staffId) => {
    return api.get(`/voice-logs?staffId=${staffId}`);
  },

  createVoiceLog: async (logData) => {
    // logData: { staffId, audioFileUrl, detectedText, correctedProductId }
    return api.post("/voice-logs", logData);
  },

  updateVoiceLog: async (id, logData) => {
    return api.put(`/voice-logs/${id}`, logData);
  },

  markAsTrained: async (id) => {
    return api.put(`/voice-logs/${id}/trained`, { isTrained: true });
  },

  deleteVoiceLog: async (id) => {
    return api.delete(`/voice-logs/${id}`);
  },
};
