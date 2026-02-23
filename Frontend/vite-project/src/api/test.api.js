import axiosClient from "./axiosClient";

export const testApi = {
  connection: () => {
    return axiosClient.get("/test/connection");
  },
};
