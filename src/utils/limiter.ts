import rateLimit from "express-rate-limit"

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { status: 'failed', message: 'Too many requests, try again later.' },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { status: 'failed', message: 'Too many attempts, try again later.' }
})