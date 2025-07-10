// src/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:9000"); // adjust port if needed
