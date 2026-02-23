import axiosClient from "./axiosClient";

export const voiceLogsApi = {
  getAll: () => {
    return axiosClient.get("/voice-logs");
  },

  getById: (id) => {
    return axiosClient.get(`/voice-logs/${id}`);
  },

  getByStaff: (staffId) => {
    return axiosClient.get(`/voice-logs?staffId=${staffId}`);
  },

  create: (data) => {
    return axiosClient.post("/voice-logs", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/voice-logs/${id}`, data);
  },

  markAsTrained: (id) => {
    return axiosClient.put(`/voice-logs/${id}/trained`, { isTrained: true });
  },

  delete: (id) => {
    return axiosClient.delete(`/voice-logs/${id}`);
  },

  // Voice recognition
  recognizeVoice: (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice-order.webm");
    
    return axiosClient.post("/ai/recognize", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
