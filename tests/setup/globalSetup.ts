import { db } from '../../src/db/connection.ts'
import { users, habits, entries, habitTags, tags } from '../../src/db/schema.ts'
import { sql } from 'drizzle-orm'
import { execSync } from 'node:child_process'

export default async function setup() {
  console.log('Setting up the test DB')
  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

    console.log('Pushing schema to the DB')
    execSync(
      `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    )

    console.log('Test database created')
  } catch (e) {
    console.error('Failed to setup test DB:', e)
    throw e
  }

  return async () => {
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)
    } catch (e) {
      console.error('Failed to drop test DB:', e)
      throw e
    }
  }
}
