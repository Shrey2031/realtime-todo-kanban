import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','PUT','POST','DELETE'],
    credentials:true
}))

app.use(express.json({limit:'12kb'}));
app.use(express.urlencoded({extended:true,limit:'12kb'}));
app.use(express.static('public'));
app.use(cookieParser());

import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import logRoutes from './routes/log.routes.js';


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks',taskRoutes);
app.use('/api/v1/logs', logRoutes);
export { app };