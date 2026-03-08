import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import {
  createHabitSchema,
  updateHabitParamsSchema,
  updateHabitSchema,
} from '../validations/habit.ts'
import { habitController } from '../di/container.ts'
import { authenticateToken } from '../middleware/auth.ts'

const router = Router()

router.use(authenticateToken)

router.get('/', habitController.getAllForUser)

router.patch(
  '/:id',
  validateBody(updateHabitSchema),
  validateParams(updateHabitParamsSchema),
  habitController.updateHabit,
)

router.get('/:id', (req, res) => {
  const id = req.params.id
  res.status(200).json({ message: `habit ${id}` })
})

router.post('/', validateBody(createHabitSchema), habitController.createHabit)

router.delete('/:id', (req, res) => {
  const id = req.params.id
  res.status(200).json({ message: `habit ${id} deleted` })
})

router.post('/:id/complete', (req, res) => {
  const id = req.params.id
  res.status(200).json({ message: `habit ${id} completed` })
})

export default router
