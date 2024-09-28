import dotenv from "dotenv"
dotenv.config();
import express from 'express'

import cookieParser from "cookie-parser"
import session from 'express-session'

import http from 'http'
import cors from 'cors'




//Routes root
import userRoute from '../router/userRoute'
import spRoute from '../router/spRoute'
import adminRoute from '../router/adminRoute'
import chatRoute from '../router/chatRoute'


const app = express();

export const httpServer = http.createServer(app)

app.use(cors({
  origin: process.env.CORS_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
app.use(cookieParser());
  
app.use(session({
  secret:  process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
}));
  

app.use("/api/user", userRoute)
app.use("/api/sp",spRoute)
app.use("/api/admin",adminRoute)
app.use("/api/chat",chatRoute)
