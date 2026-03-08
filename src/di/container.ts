import { AuthController } from "../controllers/auth.controller.ts";
import { HabitController } from "../controllers/habit.controller.ts";
import { HabitRepository } from "../repositories/habit.repository.ts";
import { UserRepository } from "../repositories/user.repository.ts";
import { AuthService } from "../services/auth.service.ts";
import { HabitService } from "../services/habit.service.ts";

const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
export const authController = new AuthController(authService)

const habitRepository = new HabitRepository()
const habitService = new HabitService(habitRepository)
export const habitController = new HabitController(habitService)