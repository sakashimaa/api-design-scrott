import { Router, type Response } from 'express'
import { type AuthenticatedRequest } from '../middleware/auth.ts'

const router = Router()

router.get('/profile', (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json(req.user)
})

router.get('/', (req, res) => {
  res.status(200).json({ message: 'users' })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  res.status(200).json({ message: `user ${id}` })
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  res.status(200).json({ message: `user ${id} updated` })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  res.status(200).json({ message: `user ${id} deleted` })
})

export default router
