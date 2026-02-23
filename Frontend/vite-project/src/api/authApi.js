import axios from "axios";

const API_URL = "https://localhost:7031/api/auth";

export const loginApi = (data) => {
  return axios.post(`${API_URL}/login`, data);
};
