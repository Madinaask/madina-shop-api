import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { connectDB } from './config/db.js'
import { mountSwagger } from './config/swagger.js'

import User from './models/User.js'

import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import categoriesRouter from './routes/categories.js'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import { productReviewsRouter, reviewsRouter } from './routes/reviews.js'

import errorHandler from './middlewares/errorHandler.js'

const app = express()
app.set('trust proxy', 1)
const PORT = process.env.PORT || 3000

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://madina-shop.vercel.app',
  'http://localhost:5173',
].filter(Boolean)

app.use(helmet())
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)
app.use(express.json())
app.use(morgan('dev'))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много попыток, попробуйте позже' },
})

app.get('/', (req, res) => {
  res.json({
    message: 'Plume API',
    docs: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      orders: '/api/orders',
      reviews: '/api/reviews',
      productReviews: '/api/products/:productId/reviews',
    },
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

app.use('/api/auth', authLimiter, authRouter)
app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/products/:productId/reviews', productReviewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/reviews', reviewsRouter)

mountSwagger(app)

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' })
})

app.use(errorHandler)

await connectDB(process.env.MONGO_URI)

if (process.env.ADMIN_EMAIL) {
  const result = await User.updateOne(
    { email: process.env.ADMIN_EMAIL.toLowerCase() },
    { $set: { role: 'admin' } }
  )
  if (result.matchedCount > 0) {
    console.log(`Пользователь ${process.env.ADMIN_EMAIL} назначен администратором`)
  }
}

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})
