import { db } from '../db/connection.ts'
import { habits, entries, habitTags, tags } from '../db/schema.ts'
import { eq, and, desc, inArray } from 'drizzle-orm'
import type { CreateHabitDto } from '../dto/habit/create-habit.dto.ts'
import type { Tx } from '../utils/transaction.ts'
import type { UpdateHabitDto } from '../dto/habit/update-habit.dto.ts'

export class HabitRepository {
  async createHabitWithHabitTags(dto: CreateHabitDto, tx?: Tx) {
    const executor = tx ?? db
    const [newHabit] = await executor
      .insert(habits)
      .values({
        userId: dto.userId,
        name: dto.name,
        description: dto.description,
        frequency: dto.frequency,
        targetCount: dto.targetCount,
      })
      .returning()

    if (dto?.tagIds && dto?.tagIds?.length > 0) {
      const habitTagValues = dto.tagIds.map((tagId) => ({
        habitId: newHabit.id,
        tagId,
      }))

      await executor.insert(habitTags).values(habitTagValues)
    }

    return newHabit
  }

  async getAllHabitsForUser(userId: string, tx?: Tx) {
    const executor = tx ?? db

    const userHabitsWithTags = await executor.query.habits.findMany({
      where: eq(habits.userId, userId),
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    })

    return userHabitsWithTags.map(({ habitTags, ...habit }) => ({
      ...habit,
      tags: habitTags.map((ht) => ht.tag),
    }))
  }

  async getHabitById(habitId: string, tx?: Tx) {
    const executor = tx ?? db

    const habit = await executor.query.habits.findFirst({
      where: eq(habits.id, habitId),
    })

    return habit
  }

  async updateHabit(dto: UpdateHabitDto, tx?: Tx) {
    const executor = tx ?? db

    const [updatedHabit] = await executor
      .update(habits)
      .set({
        name: dto.name,
        description: dto.description,
        frequency: dto.frequency,
        targetCount: dto.targetCount,
        isActive: dto.isActive,
        updatedAt: new Date(),
      })
      .where(eq(habits.id, dto.habitId))
      .returning()

    if (dto?.tagIds !== undefined) {
      await executor.delete(habitTags)
        .where(eq(habitTags.habitId, dto.habitId))

      if (dto.tagIds?.length > 0) {
        const habitTagValues = dto.tagIds.map((tagId) => ({
          habitId: dto.habitId,
          tagId,
        }))

        await executor.insert(habitTags).values(habitTagValues)
      }
    }

    return updatedHabit
  }
}
