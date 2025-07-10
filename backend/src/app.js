import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

 

const app = express();

app.use(cors({
    origin:"https://kanban-frontend-wqv8.onrender.com",
    methods:['GET','PUT','POST','DELETE'],
    credentials:true
}))




app.use(express.json({limit:'12kb'}));
app.use(express.urlencoded({extended:true,limit:'12kb'}));
app.use(express.static('public'));
app.use(cookieParser());

import userRoutes from './routes/user.routes.js';
app.use('/api/v1/users', userRoutes);
export { app };