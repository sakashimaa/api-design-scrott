import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type JWTPayload } from '../utils/jwt.ts'
import { authFailedMessage } from '../constants/authMessage.ts'

export interface AuthenticatedRequest<TBody = any> extends Request<{}, {}, TBody> {
  user?: JWTPayload
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      return res.status(401).json(authFailedMessage)
    }

    const bearer = authHeader.split(' ')[1]
    if (!bearer) {
      return res.status(401).json(authFailedMessage)
    }

    const verified = await verifyToken(bearer)
    req.user = verified
    
    next()
  } catch (err) {
    return res.status(401).json(authFailedMessage)
  }
}