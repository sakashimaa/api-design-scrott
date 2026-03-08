import { jwtVerify, SignJWT } from 'jose'
import { createSecretKey, KeyObject } from 'node:crypto'
import env from '../../env.ts'

export interface JWTPayload {
  id: string;
  email: string;
  username: string;
  [key: string]: unknown;
}

const getSecretKey = (): KeyObject => {
  const secret = env.JWT_SECRET
  const secretKey = createSecretKey(secret, 'utf-8')

  return secretKey
}

export const generateToken = (payload: JWTPayload) => {
  const secretKey = getSecretKey()

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || '1h')
    .sign(secretKey)
}

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const secretKey = getSecretKey()
  const { payload } = await jwtVerify(token, secretKey)

  return payload as JWTPayload
}