import request from 'supertest'
import { app } from '../src/server.ts'
import env from '../env.ts'
import { createTestUser, cleanupDatabase } from './setup/dbHelpers.ts'

describe('Authentication Endpoints', () => {
  afterEach(async () => {
    await cleanupDatabase()
  })
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test-email@example.com',
          username: 'testuser',
          password: 'testsupersecret123',
        })
        .expect(201)

      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).not.toHaveProperty('password')
    })
  })
  describe('POST /api/auth/login', () => {
    it('should log in with valid credentials', async () => {
      const testUser = await createTestUser()
      const credentials = {
        email: testUser.user.email,
        password: testUser.rawPassword,
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(201)

      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
    })
  })
})
