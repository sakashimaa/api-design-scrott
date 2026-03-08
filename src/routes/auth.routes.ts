import { Router } from 'express'
import { authController } from '../di/container.ts'
import { validateBody } from '../middleware/validation.ts'
import { createUserSchema } from '../validations/user.ts'
import { loginSchema } from '../validations/auth.ts'

const router = Router()

router.post('/register', validateBody(createUserSchema), authController.register)

router.post('/login', validateBody(loginSchema), authController.login)

export default router
