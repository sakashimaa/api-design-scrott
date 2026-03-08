import type { NewUser } from '../db/schema.ts'
import type { LoginDto } from '../dto/auth/login.dto.ts'
import type { UserRepository } from '../repositories/user.repository.ts'
import { HttpException } from '../utils/http-exception.ts'
import { generateToken } from '../utils/jwt.ts'
import { hashPassword, verifyPassword } from '../utils/password.ts'

export class AuthService {
  private userRepo: UserRepository

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  async register(dto: NewUser) {
    const hashedPassword = await hashPassword(dto.password)
    const user = await this.userRepo.create({
      ...dto,
      password: hashedPassword,
    })
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return { user, token }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.getByEmail(dto.email)
    if (!user) {
      throw new HttpException(401, 'Invalid credentials.')
    }

    const passwordCorrect = await verifyPassword(dto.password, user.password)
    if (!passwordCorrect) {
      throw new HttpException(401, 'Invalid credentials.')
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    const { password: _, ...returningUser } = user

    return { token, user: returningUser }
  }
}
