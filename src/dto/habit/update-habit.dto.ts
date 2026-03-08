export type UpdateHabitDto = {
  userId: string;
  habitId: string;
  tagIds?: string[];
  name?: string;
  description?: string;
  frequency?: string;
  targetCount?: number;
  isActive?: boolean;
}