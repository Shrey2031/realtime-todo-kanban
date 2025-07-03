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

export { app };