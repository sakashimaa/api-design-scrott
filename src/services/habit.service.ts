import db from "../db/connection.ts";
import type { CreateHabitDto } from "../dto/habit/create-habit.dto.ts";
import type { UpdateHabitDto } from "../dto/habit/update-habit.dto.ts";
import type { HabitRepository } from "../repositories/habit.repository.ts";
import { HttpException } from "../utils/http-exception.ts";

export class HabitService {
  private habitRepository: HabitRepository

  constructor(habitRepository: HabitRepository) {
    this.habitRepository = habitRepository
  }

  async createHabitWithHabitTags(dto: CreateHabitDto) {
    return await db.transaction(async (tx) => {
      const createdHabit = await this.habitRepository.createHabitWithHabitTags(dto, tx)

      return createdHabit
    })
  }

  async getAllHabitsForUser(userId: string) {
    return await this.habitRepository.getAllHabitsForUser(userId)
  }

  async updateHabit(dto: UpdateHabitDto) {
    return await db.transaction(async (tx) => {
      const habit = await this.habitRepository.getHabitById(dto.habitId, tx)

      if (!habit) {
        throw new HttpException(404, 'habit not found.')
      }

      if (habit.userId !== dto.userId) {
        throw new HttpException(401, 'habit is not owned by user.')
      }

      return await this.habitRepository.updateHabit(dto, tx)
    })
  }  
}