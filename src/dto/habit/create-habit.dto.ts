export type CreateHabitDto = {
  userId?: string;
  tagIds?: string[];
  name: string;
  description?: string;
  frequency: string;
  targetCount?: number;
  isActive?: boolean;
}