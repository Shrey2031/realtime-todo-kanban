import API from "./axiosInstance";

export const registerUser = (userData) => API.post("/users/register", userData);

export const loginUser = (credentials) => API.post("/users/login", credentials);
