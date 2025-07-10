import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import {app} from "./src/app.js"; 
import connectDB from "./src/db/connection.js";
import { initSocket } from "./src/db/socket.js";

dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 9000; 

const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "https://kanban-task-manager-7soo.onrender.com", 
    methods: ["GET", "POST"]
  }
});

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });


import taskRoutes from './src/routes/task.routes.js';
import logRoutes from './src/routes/log.routes.js';



app.use('/api/v1/tasks',(req, res, next) => {
  req.io = io; // ✅ attach socket instance
  next();
},taskRoutes);
app.use('/api/v1/logs',(req, res, next) => {
  req.io = io;
  next();
}, logRoutes);

connectDB();
initSocket(io);
// Sample API route
app.get("/", (req, res) => {
  res.send("Server Running");
});



server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
