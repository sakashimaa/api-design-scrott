import { eq } from "drizzle-orm";
import db from "../db/connection.ts";
import { users, type NewUser } from "../db/schema.ts";

export class UserRepository {
  async create(data: NewUser) {
    const [user] = await db.insert(users)
      .values(data)
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })

    return user
  }

  async getByEmail(email: string) {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
      password: users.password,
    })
      .from(users)
      .where(eq(users.email, email))

    return user
  }
}