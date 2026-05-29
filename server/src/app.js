import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/auth.routes.js'
import newsRoutes from './routes/news.routes.js'
import programRoutes from './routes/programs.routes.js'
import userRoutes from './routes/users.routes.js'
import financeRoutes from './routes/finance.routes.js'
import structureRoutes from './routes/structure.routes.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { DB_DRIVER } from './store/index.js'

export function createApp() {
  const app = express()

  const corsOrigin = process.env.CORS_ORIGIN
  app.use(cors(corsOrigin ? { origin: corsOrigin.split(',').map((o) => o.trim()) } : {}))
  app.use(express.json())
  app.use(morgan('dev'))

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'karang-taruna-api', driver: DB_DRIVER, time: new Date().toISOString() })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/news', newsRoutes)
  app.use('/api/programs', programRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/finance', financeRoutes)
  app.use('/api/structure', structureRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
