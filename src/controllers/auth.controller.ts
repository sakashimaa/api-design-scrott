import type { Request, Response } from 'express'
import { type NewUser } from '../db/schema.ts'
import { AuthService } from '../services/auth.service.ts'
import { HttpException } from '../utils/http-exception.ts'

export class AuthController {
  private authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  register = async (req: Request<any, any, NewUser>, res: Response) => {
    try {
      const result = await this.authService.register(req.body)

      res.status(201).json({
        status: 'success',
        ...result,
      })
    } catch (err) {
      console.error('Registration error:', err)
      res.status(500).json({ status: 'failed', error: 'Failed to create user' })
    }
  }

  login = async (req: Request<any, any, { email: string, password: string }>, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password })
      res.status(201).json({ status: 'success', ...result })
    } catch (err) {
      if (err instanceof HttpException) {
        console.error('failed to login:', err.message);
        return res.status(err.statusCode).json({ status: 'failed', message: err.message })
      }
      
      return res.status(500).json({ status: 'failed', message: 'unknown error' })
    }
  }
}
