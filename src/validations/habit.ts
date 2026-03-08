import z from "zod";

export const createHabitSchema = z.object({
  tagIds: z.array(z.string()).optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  frequency: z.string().min(1),
  targetCount: z.coerce.number().positive().optional(),
  isActive: z.coerce.boolean().optional(),
})

export const updateHabitSchema = z.object({
  tagIds: z.array(z.string()).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  frequency: z.string().optional(),
  targetCount: z.coerce.number().positive().optional(),
  isActive: z.coerce.boolean().optional(),
})

export const updateHabitParamsSchema = z.object({
  id: z.uuid().min(1),
})