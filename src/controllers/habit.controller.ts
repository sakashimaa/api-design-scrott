import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import type { HabitService } from '../services/habit.service.ts'
import type { CreateHabitDto } from '../dto/habit/create-habit.dto.ts'
import { success, fail } from '../utils/http-response.ts'
import type { UpdateHabitDto } from '../dto/habit/update-habit.dto.ts'
import { HttpException } from '../utils/http-exception.ts'

export class HabitController {
  private habitService: HabitService

  constructor(habitService: HabitService) {
    this.habitService = habitService
  }

  createHabit = async (
    req: AuthenticatedRequest<CreateHabitDto>,
    res: Response,
  ) => {
    try {
      const user = req.user!

      const result = await this.habitService.createHabitWithHabitTags({
        ...req.body,
        userId: user.id,
      })

      success(res, 'habit created', result, 201)
    } catch (err) {
      console.error('Create habit failed:', err)
      fail(res, 'Create habit failed')
    }
  }

  getAllForUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!

      const result = await this.habitService.getAllHabitsForUser(user.id)
      success(res, 'get all habits for user', result)
    } catch (err) {
      console.error('failed to get all habits for user:', err)
      fail(res, 'Get all habits for user failed')
    }
  }

  updateHabit = async (
    req: AuthenticatedRequest<UpdateHabitDto> & { params: { id: string } },
    res: Response,
  ) => {
    try {
      const user = req.user!
      const habitId = req.params.id

      const updated = await this.habitService.updateHabit({
        ...req.body,
        userId: user.id,
        habitId,
      })

      success(res, 'habit updated', updated)
    } catch (err) {
      if (err instanceof HttpException) {
        console.error('failed to update habit:', err.message)
        return fail(res, err.message, err.statusCode)
      }

      console.error('failed to update habit:', err)
      fail(res, 'Failed to update habit')
    }
  }
}
