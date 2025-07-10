import API from "./axiosInstance";

export const fetchTasks = () => API.get("/tasks");

export const createTask = (taskData) => API.post("/tasks", taskData);

export const updateTask = (taskId, updates) => API.put(`/tasks/${taskId}`, updates);

export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);

export const smartAssignTask = (taskId) => API.put(`/tasks/smart-assign/${taskId}`);
