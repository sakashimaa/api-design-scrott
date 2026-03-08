import type { Response } from 'express'

export type HttpResponse<T = unknown> = {
  status: 'success' | 'failed'
  message: string
  data?: T
}

export const success = <T>(res: Response, message: string, data?: T, statusCode = 200) => {
  const body: HttpResponse<T> = { status: 'success', message }
  if (data !== undefined) body.data = data
  return res.status(statusCode).json(body)
}

export const fail = (res: Response, message: string, statusCode = 500) => {
  return res.status(statusCode).json({ status: 'failed', message } satisfies HttpResponse)
}
