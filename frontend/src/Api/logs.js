import API from "./axiosInstance";

export const fetchLogs = () => API.get("/logs");
