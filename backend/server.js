import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { AppError } from './errors/AppError.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'

const app = express()
const port = process.env.PORT ?? 5000
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/tokokita'

const clientOrigins = (process.env.CLIENT_URL ?? 'http://localhost:5173')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || clientOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Origin tidak diizinkan oleh CORS'))
    },
  }),
)
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.use((request, response) => {
  response.status(404).json({ message: `Endpoint ${request.path} tidak ditemukan` })
})

app.use((error, _request, response, _next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return response.status(400).json({
      message: 'Data produk tidak valid',
      errors: Object.values(error.errors).map((item) => item.message),
    })
  }

  console.error(error)
  response.status(500).json({ message: 'Terjadi kesalahan pada server' })
})

async function startServer() {
  try {
    await mongoose.connect(mongoUri)
    app.listen(port, () => {
      console.log(`API berjalan di http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Gagal terhubung ke MongoDB:', error.message)
    process.exitCode = 1
  }
}

startServer()
