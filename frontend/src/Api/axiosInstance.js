import axios from "axios";

const API = axios.create({
  baseURL: "import.meta.env.https://kanban-task-manager-7soo.onrender.com", 
  withCredentials:true,// change for production
});

// Attach token to headers automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token){
    config.headers.Authorization = `Bearer ${token}`
  } ;
  return config;
});

console.log("🪵 Global token check:", localStorage.getItem("token"));


export default API;
