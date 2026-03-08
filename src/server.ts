import express, { Router } from 'express'
import userRoutes from './routes/user.routes.ts'
import authRoutes from './routes/auth.routes.ts'
import habitRoutes from './routes/habit.routes.ts'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { isTest } from '../env.ts'
import { authLimiter, limiter } from './utils/limiter.ts'
import { authenticateToken } from './middleware/auth.ts'
import { ApiError, errorHandler } from './middleware/errorHandler.ts'

const app = express()

app.use(helmet())
app.use(cors())
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  morgan('dev', {
    skip: () => isTest(),
  }),
)

app.get('/health', (req, res) => {
  res.send('hello world!')
})

const apiRouter = Router()
const v1Router = Router()

app.use('/api', apiRouter)
apiRouter.use('/v1', v1Router)

v1Router.use('/users', authenticateToken, userRoutes)
v1Router.use('/auth', authLimiter, authRoutes)
v1Router.use('/habits', authenticateToken, habitRoutes)

app.use(errorHandler)

export { app }
