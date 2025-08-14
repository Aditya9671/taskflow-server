import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes from './src/routes/authRoutes.js'
import taskRoutes from './src/routes/taskRoutes.js'
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
app.use(cors({
  origin: process.env.CLIENT_URL,  // Will use the URL from .env
  credentials: true
}));

app.set('io', io)

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))

app.get('/', (_req, res) => res.send({ status: 'ok', message: 'TaskFlow API running' }))

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5001
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow'

mongoose.connect(MONGO_URI).then(()=>{
  console.log('MongoDB connected')
  httpServer.listen(PORT, ()=> console.log('Server listening on', PORT))
}).catch(err=>{
  console.error(err)
  process.exit(1)
})
