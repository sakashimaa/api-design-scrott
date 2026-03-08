import type { Request, Response, NextFunction } from 'express'
import env from '../../env.ts'

export class ApiError extends Error {
  statusCode: number
  name: string
  message: string

  constructor(message: string, name: string, statusCode: number) {
    super(message)
    this.name = name
    this.statusCode = statusCode
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (env.NODE_ENV === 'development') {
    console.error(err)
  }

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ name: err.name, message: err.message })
  }

  console.error(err)
  return res
    .status(500)
    .json({ name: 'Unknown error', message: 'Unknown server error occured' })
}
